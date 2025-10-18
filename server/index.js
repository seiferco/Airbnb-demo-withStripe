// server/index.js (ESM)
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  LISTINGS, bookings, isFree, createHold,
  consumeHold, confirmBooking
} from './store.js';

// Load server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

/** HEALTH CHECK */
app.get('/api/health', (_,res)=>res.json({ ok: true }));

/** Stripe webhook FIRST (raw body). Only needed if you test webhooks. */
if (process.env.STRIPE_WEBHOOK_SECRET) {
  app.post('/api/stripe-webhook',
    bodyParser.raw({ type: 'application/json' }),
    async (req, res) => {
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          req.headers['stripe-signature'],
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('Webhook signature failed', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'checkout.session.completed') {
        const s = event.data.object;
        const { listingId, start, end, holdId } = s.metadata || {};
        const hold = consumeHold(String(holdId));
        if (hold && isFree(String(listingId), String(start), String(end))) {
          confirmBooking(String(listingId), String(start), String(end));
        } else {
          console.warn('Conflict detected after payment (test env).');
          // Optionally issue a refund in test mode here
        }
      }
      res.json({ received: true });
    }
  );
}

/** other middleware AFTER webhook */
app.use(cors());
app.use(express.json());

/** Availability */
app.get('/api/availability', (req, res) => {
  const listing = req.query.listing || LISTINGS[0].id;
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start and end YYYY-MM-DD required' });
  return res.json({ listing, start, end, available: isFree(listing, start, end) });
});

/** Hold */
app.post('/api/hold', (req, res) => {
  const listing = req.body.listing || LISTINGS[0].id;
  const { start, end } = req.body;
  if (!start || !end) return res.status(400).json({ error: 'start and end required' });
  if (!isFree(listing, start, end)) return res.status(409).json({ error: 'Dates no longer available' });
  const hold = createHold(listing, start, end, 10);
  res.json({ hold });
});

/** Checkout */
app.post('/api/checkout', async (req, res) => {
  const listing = req.body.listing || LISTINGS[0].id;
  const { start, end, holdId } = req.body;
  if (!start || !end || !holdId) return res.status(400).json({ error: 'start, end, holdId required' });

  const L = LISTINGS.find(l => l.id === listing);
  const nights = Math.max(1, Math.round((Date.parse(end + 'T00:00:00') - Date.parse(start + 'T00:00:00')) / (24 * 3600 * 1000)));
  const amount = L.nightlyPrice * nights + L.cleaningFee;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/?success=1`,
      cancel_url: `${process.env.SITE_URL}/?canceled=1`,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: { name: `${L.title} — ${start} to ${end}`, description: `${nights} night(s) + cleaning` }
        }
      }],
      metadata: { listingId: listing, start, end, holdId }
    });
    return res.json({ url: session.url });
  } catch (e) {
    console.error('Stripe checkout error:', e);
    return res.status(500).json({ error: String(e.message || e) });
  }
});

/** ICS export (Airbnb import) */
app.get('/api/calendar/:listing.ics', (req, res) => {
  const listing = req.params.listing || LISTINGS[0].id;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//YourBrand//DirectBooking//EN'];
  for (const b of bookings) {
    if (b.listingId !== listing || b.status !== 'confirmed') continue;
    const uid = `booking-${b.id}@yourdomain.com`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    lines.push('BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${b.start.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${b.end.replace(/-/g, '')}`,
      `SUMMARY:Direct booking - ${listing}`,
      'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="calendar.ics"');
  res.send(lines.join('\r\n'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
