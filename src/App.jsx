import { useEffect, useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useSocket } from './hooks/useSocket'
import SensorPanel from './components/SensorPanel'
import PodGrid from './components/PodGrid'
import PodModal from './components/PodModal'
import Recommendations from './components/Recommendations'
import TowerView from './components/TowerView'
import AuthModal from './components/AuthModal'

export default function App() {
  const { connected, pods, sensorData, updatePod } = useSocket()
  const [speciesDb, setSpeciesDb] = useState({})
  const [selectedPod, setSelectedPod] = useState(null)
  const [token, setToken] = useState(() => sessionStorage.getItem('hydro_token') || '')
  const [showAuthModal, setShowAuthModal] = useState(false)

  const isAdmin = !!token

  useEffect(() => {
    fetch('/hydro-dashboard/species.json')
      .then(r => r.json())
      .then(setSpeciesDb)
  }, [])

  const handleSave = async (podId, species, plantedAt) => {
    try {
      const status = await updatePod(podId, species, plantedAt, token)
      if (status === 401) {
        setToken('')
        sessionStorage.removeItem('hydro_token')
        setShowAuthModal(true)
      } else if (status >= 400) {
        console.error(`Pod update failed: HTTP ${status}`)
        alert(`Failed to save pod (HTTP ${status}). Check the console for details.`)
      }
    } catch (err) {
      console.error('Pod update network error:', err)
      alert(`Failed to reach the backend: ${err.message}`)
    }
  }

  const handleLock = () => {
    setToken('')
    sessionStorage.removeItem('hydro_token')
  }

  const handleAuth = (t) => {
    setToken(t)
    setShowAuthModal(false)
  }

  const handlePodClick = (pod) => {
    if (!isAdmin) {
      setShowAuthModal(true)
      return
    }
    setSelectedPod(pod)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-teal-600">Hydro Dashboard</h1>
            <p className="text-xs text-slate-400">Tower maintenance & monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {pods.filter(p => p.species).length} / {pods.length} pods occupied
            </span>
            {isAdmin ? (
              <button
                onClick={handleLock}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
              >
                <Unlock size={12} /> Edit Mode
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                <Lock size={12} /> View Only
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SensorPanel sensorData={sensorData} connected={connected} />
          <Recommendations pods={pods} speciesDb={speciesDb} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Tower Pods</h2>
            {!isAdmin && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Lock size={11} /> Click a pod to log in and edit
              </span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
            <div className="flex justify-center md:block">
              {pods.length > 0 && (
                <TowerView pods={pods} onPodClick={handlePodClick} />
              )}
            </div>
            {pods.length > 0 && (
              <PodGrid pods={pods} onPodClick={handlePodClick} />
            )}
          </div>
        </div>
      </main>

      {selectedPod && isAdmin && (
        <PodModal
          pod={selectedPod}
          speciesDb={speciesDb}
          onClose={() => setSelectedPod(null)}
          onSave={handleSave}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onAuth={handleAuth}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}
