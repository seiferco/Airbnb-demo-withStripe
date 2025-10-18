// server/store.js (ESM)
function uid(p=''){ return p + Math.random().toString(36).slice(2,10) + Date.now().toString(36); }

export const LISTINGS = [{
  id: 'cedar-ridge',
  title: 'Cedar Ridge Retreat',
  timezone: 'America/Los_Angeles',
  nightlyPrice: 25000, // cents
  cleaningFee: 9500    // cents
}];

export const bookings = [];      // {id, listingId, start, end, status, createdAt}
export const holds = [];         // {id, listingId, start, end, expiresAt, createdAt}
export const externalBlocks = []; // mock external (Airbnb) blocks

function shift(dateStr, days){
  const d = new Date(dateStr + 'T00:00:00'); d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
}

function addMockExternalBlocks() {
  const listingId = LISTINGS[0].id;
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth()+1).padStart(2,'0');
  const d = String(t.getDate()).padStart(2,'0');
  const base = `${y}-${m}-${d}`;
  [[5,8],[12,14]].forEach(([a,b])=>{
    externalBlocks.push({ id: uid('blk_'), listingId, start: shift(base,a), end: shift(base,b), source:'mock-ical' });
  });
}
addMockExternalBlocks();

function overlap(aStart,aEnd,bStart,bEnd){ return aStart < bEnd && aEnd > bStart; }

export function isFree(listingId,start,end){
  const now = Date.now();
  for (const b of bookings)
    if (b.listingId===listingId && b.status==='confirmed' && overlap(start,end,b.start,b.end)) return false;
  for (const h of holds)
    if (h.listingId===listingId && h.expiresAt>now && overlap(start,end,h.start,h.end)) return false;
  for (const x of externalBlocks)
    if (x.listingId===listingId && overlap(start,end,x.start,x.end)) return false;
  return true;
}

export function createHold(listingId,start,end,minutes=10){
  const h={ id: uid('hold_'), listingId, start, end, createdAt:new Date().toISOString(), expiresAt: Date.now()+minutes*60*1000 };
  holds.push(h); return h;
}

export function consumeHold(holdId){
  const i = holds.findIndex(h=>h.id===holdId);
  if (i===-1) return null;
  const [h] = holds.splice(i,1);
  return h;
}

export function confirmBooking(listingId,start,end){
  const b={ id: uid('bk_'), listingId, start, end, status:'confirmed', createdAt:new Date().toISOString() };
  bookings.push(b); return b;
}

// cleanup expired holds
setInterval(()=>{ const now=Date.now(); for(let i=holds.length-1;i>=0;i--) if(holds[i].expiresAt<=now) holds.splice(i,1); }, 60*1000);
