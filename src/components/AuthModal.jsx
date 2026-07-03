import { useState } from 'react'
import { Lock, X } from 'lucide-react'

export default function AuthModal({ onAuth, onClose }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

    // Test the token against a write endpoint
    const res = await fetch(`${BACKEND_URL}/api/pods/0`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${value}`,
      },
      body: JSON.stringify({}),
    })

    // 404 = pod doesn't exist but auth passed; 401 = wrong token
    if (res.status === 401) {
      setError(true)
    } else {
      sessionStorage.setItem('hydro_token', value)
      onAuth(value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-teal-600" />
            <h2 className="font-semibold text-slate-800">Enter Admin Password</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            placeholder="Password"
            className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-teal-400 focus:ring-teal-200'}`}
          />
          {error && <p className="text-red-500 text-xs">Incorrect password.</p>}
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-lg py-2 text-sm font-medium transition-colors">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
