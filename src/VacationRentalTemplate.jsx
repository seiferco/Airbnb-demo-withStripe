import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Star, Wifi, Car, Waves, Snowflake, Flame, Phone, Mail, ExternalLink, Moon, Sun } from "lucide-react";
import BookingWidget from "./components/BookingWidget.jsx";

/**
 * Vacation Rental Template Site — Minimal Gray Theme (Light/Dark)
 * - Neutral grays, soft borders, subtle shadows
 * - Theme toggle persists to localStorage
 */

const SITE = {
  brand: {
    name: "Cedar Ridge Retreat",
    tagline: "Modern cabin minutes from the lake",
    logoText: "CRR",
    primary: "#0ea5e9",
    accent: "#10b981",
  },
  location: {
    city: "Bend",
    region: "Oregon",
    country: "USA",
    coordinates: { lat: 44.0582, lng: -121.3153 },
    mapEmbed: "https://www.google.com/maps?q=Mt%20Bachelor&hl=en&z=12&output=embed",
  },
  hero: {
    image: "/photos/cabin1.jpg",
    ctaPrimary: { label: "Check Availability", href: "#book" }, // <-- now scrolls to widget
    ctaSecondary: { label: "Contact Host", href: "#contact" },
  },
  photos: [
    "/photos/cabin2.jpg",
    "/photos/cabin3.jpg",
    "/photos/cabin4.jpg",
    "/photos/cabin5.jpg",
    "/photos/cabin6.jpg",
    "/photos/cabin7.jpg",
  ],
  highlights: [
    { icon: CalendarDays, label: "Sleeps 6" },
    { icon: MapPin, label: "5 min to Old Mill" },
    { icon: Star, label: "4.95 host rating" },
  ],
  amenities: [
    { icon: Wifi, label: "Fast Wi-Fi (300 Mbps)" },
    { icon: Car, label: "Free parking" },
    { icon: Waves, label: "Hot tub" },
    { icon: Snowflake, label: "A/C" },
    { icon: Flame, label: "Fireplace" },
  ],
  description:
    "Unwind at Cedar Ridge Retreat — a bright, modern cabin tucked under Ponderosa pines. Sip coffee on the deck, soak in the hot tub after a day on the trails, and stroll to breweries in minutes.",
  checkin: {
    details: [
      "Self check-in with smart lock",
      "Quiet hours 10pm–7am",
      "No smoking, no parties",
    ],
  },
  reviews: [
    {
      name: "Maya",
      text: "Spotless, stylish, and the hot tub under the stars was unreal. 10/10!",
      rating: 5,
    },
    {
      name: "Jon",
      text: "Walkable to everything we wanted. Super host was responsive within minutes.",
      rating: 5,
    },
  ],
  contact: {
    phone: "+1 (541) 555-1212",
    email: "stay@cedarridge.com",
  },
  seo: {
    coverAlt: "Modern cabin exterior with wood siding and large windows",
  },
};

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function Section({ id, title, children, eyebrow }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div {...fade}>
        {eyebrow && (
          <div className="text-sm font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400 mb-2">
            {eyebrow}
          </div>
        )}
        {title && (
          <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">{title}</h2>
        )}
        {children}
      </motion.div>
    </section>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900 grid place-items-center font-semibold">
            {SITE.brand.logoText}
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{SITE.brand.name}</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:text-zinc-900 dark:hover:text:white text-zinc-700 dark:text-zinc-300" href="#gallery">Gallery</a>
          <a className="hover:text-zinc-900 dark:hover:text:white text-zinc-700 dark:text-zinc-300" href="#amenities">Amenities</a>
          <a className="hover:text-zinc-900 dark:hover:text:white text-zinc-700 dark:text-zinc-300" href="#location">Location</a>
          <a className="hover:text-zinc-900 dark:hover:text:white text-zinc-700 dark:text-zinc-300" href="#reviews">Reviews</a>
          <a className="hover:text-zinc-900 dark:hover:text:white text-zinc-700 dark:text-zinc-300" href="#contact">Contact</a>
          <a href="#book" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition">
            Book <ExternalLink size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 z-0" />
      <img
        src={SITE.hero.image}
        alt={SITE.seo.coverAlt}
        className="h-[70vh] w-full object-cover"
      />
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div {...fade} className="max-w-xl">
            <span className="text-white/90 text-sm tracking-widest uppercase">{SITE.brand.tagline}</span>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mt-3">
              {SITE.brand.name} — {SITE.location.city}, {SITE.location.region}
            </h1>
            <p className="text-white/90 mt-3 leading-relaxed">
              {SITE.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={SITE.hero.ctaPrimary.href}
                className="rounded-2xl px-5 py-3 bg-zinc-900 text-white hover:bg-zinc-800 transition"
              >
                {SITE.hero.ctaPrimary.label}
              </a>
              <a
                href={SITE.hero.ctaSecondary.href}
                className="rounded-2xl px-5 py-3 bg-white/90 text-zinc-900 hover:bg-white transition"
              >
                {SITE.hero.ctaSecondary.label}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Highlights() {
  return (
    <Section id="highlights" eyebrow="Why you'll love it">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SITE.highlights.map((h, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm bg-white dark:bg-zinc-900 flex items-center gap-3"
          >
            <h.icon className="text-zinc-600 dark:text-zinc-300" />
            <div className="text-zinc-900 dark:text-zinc-100 font-medium">{h.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Gallery() {
  return (
    <Section id="gallery" title="Gallery">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SITE.photos.map((src, idx) => (
          <motion.img
            {...fade}
            key={idx}
            src={src}
            alt={`Photo ${idx + 1} of ${SITE.brand.name}`}
            className="rounded-2xl h-52 w-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
          />)
        )}
      </div>
    </Section>
  );
}

/** NEW: Direct booking section with the widget */
function DirectBooking() {
  return (
    <Section id="book" title="Direct Booking (Demo)">
      <BookingWidget />
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
        Test mode — use 4242 4242 4242 4242 with any future date/CVC/ZIP.
      </p>
    </Section>
  );
}

function Amenities() {
  return (
    <Section id="amenities" title="Amenities">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {SITE.amenities.map((a, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 flex items-center gap-3"
          >
            <a.icon className="text-zinc-600 dark:text-zinc-300" />
            <span className="text-zinc-800 dark:text-zinc-200">{a.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function LocationMap() {
  return (
    <Section id="location" title="Location" eyebrow={`${SITE.location.city}, ${SITE.location.region}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Nestled in {SITE.location.city}, {SITE.location.region}, this stay puts you close to trails, river walks, and local
            coffee shops. Drive times: 7 min to downtown, 12 min to Mt. Bachelor shuttle, 25 min to trailheads.
          </p>
          <ul className="mt-4 list-disc list-inside text-zinc-700 dark:text-zinc-300 space-y-1">
            {SITE.checkin.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-50 dark:bg-zinc-900">
          <div className="relative w-full pb-[66.6%] h-0">
            <iframe
              title="Mt Bachelor Map"
              src={SITE.location.mapEmbed}
              className="absolute top-0 left-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function Reviews() {
  return (
    <Section id="reviews" title="Guest Reviews">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SITE.reviews.map((r, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: r.rating }).map((_, j) => (
                <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-zinc-800 dark:text-zinc-200">“{r.text}”</p>
            <div className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">— {r.name}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" title="Contact the Host">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-4 py-3" placeholder="Your name" />
              <input className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-4 py-3" type="email" placeholder="Your email" />
            </div>
            <input className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-4 py-3 mt-4 w-full" placeholder="Dates (e.g., Nov 10–12)" />
            <textarea className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-4 py-3 mt-4 w-full" rows={4} placeholder="Message" />
            <button type="button" className="mt-4 rounded-2xl px-5 py-3 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition">
              Send inquiry
            </button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">This is a demo form. Connect to Formspree, Formspark, or your own API in production.</p>
          </form>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 shadow-sm h-max">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200"><Phone size={18}/> {SITE.contact.phone}</div>
          <div className="flex items-center gap-2 mt-2 text-zinc-800 dark:text-zinc-200"><Mail size={18}/> {SITE.contact.email}</div>
          <a href="#book" className="mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
            Book Now <ExternalLink size={16}/>
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">Prefer direct booking? Use the widget above (Stripe test mode).</p>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <div>
          © {year} {SITE.brand.name}. {SITE.location.city}, {SITE.location.region}.
        </div>
        <div className="opacity-80">
          Powered by <a className="underline hover:text-zinc-900 dark:hover:text-zinc-100">Still House Media</a>
        </div>
      </div>
    </footer>
  );
}

export default function VacationRentalTemplate() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: SITE.brand.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    image: [SITE.hero.image, ...SITE.photos],
    url: "https://templateairbnb.com",
    telephone: SITE.contact.phone,
    amenityFeature: SITE.amenities.map(a => ({ "@type": "LocationFeatureSpecification", name: a.label, value: true })),
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <Hero />
      <Highlights />
      <Gallery />
      <DirectBooking />  
      <Amenities />
      <LocationMap />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}
