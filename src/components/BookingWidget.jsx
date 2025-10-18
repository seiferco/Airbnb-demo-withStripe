import { useState } from 'react'

export default function BookingWidget() {
  const [start,setStart] = useState('')
  const [end,setEnd] = useState('')
  const [status,setStatus] = useState('')

  async function check(){
    setStatus('Checking…')
    try {
      const r = await fetch(`/api/availability?start=${start}&end=${end}`)
      const d = await r.json()
      setStatus(d.available ? 'Available ✅' : 'Unavailable ❌')
    } catch (e) {
      setStatus('Network error (availability)')
      console.error(e)
    }
  }

  async function book(){
    setStatus('Placing 10-min hold…')
    try {
      const r1 = await fetch('/api/hold',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({start,end})})
      const j1 = await r1.json()
      if(!r1.ok){ setStatus('Hold failed: '+(j1.error||'unknown')); return }
      const { hold } = j1

      setStatus('Creating checkout…')
      const r2 = await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({start,end,holdId:hold.id})})
      const j2 = await r2.json()
      if(!r2.ok || !j2.url){ setStatus('Checkout failed: '+(j2.error||'unknown')); console.error(j2); return }
      window.location.href = j2.url
    } catch (e) {
      setStatus('Network error (checkout)')
      console.error(e)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3 bg-white dark:bg-zinc-900">
      <div>
        <label className="text-sm">Check-in (YYYY-MM-DD)</label>
        <input className="w-full border rounded p-2" value={start} onChange={e=>setStart(e.target.value)} placeholder="2025-11-03" />
      </div>
      <div>
        <label className="text-sm">Check-out (YYYY-MM-DD)</label>
        <input className="w-full border rounded p-2" value={end} onChange={e=>setEnd(e.target.value)} placeholder="2025-11-06" />
      </div>
      <div className="flex gap-2">
        <button onClick={check} className="px-3 py-2 rounded bg-black text-white">Check</button>
        <button onClick={book} className="px-3 py-2 rounded bg-blue-600 text-white">Book</button>
      </div>
      {status && <p className="text-sm opacity-80">{status}</p>}
    </div>
  )
}
