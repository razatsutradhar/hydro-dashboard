import { useEffect, useState } from 'react'
import { useSocket } from './hooks/useSocket'
import SensorPanel from './components/SensorPanel'
import PodGrid from './components/PodGrid'
import PodModal from './components/PodModal'
import Recommendations from './components/Recommendations'

export default function App() {
  const { connected, pods, sensorData, updatePod } = useSocket()
  const [speciesDb, setSpeciesDb] = useState({})
  const [selectedPod, setSelectedPod] = useState(null)

  useEffect(() => {
    fetch('/hydro-dashboard/species.json')
      .then(r => r.json())
      .then(setSpeciesDb)
  }, [])

  const handleSave = (podId, species, plantedAt) => {
    updatePod(podId, species, plantedAt)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-teal-400">Hydro Dashboard</h1>
          <p className="text-xs text-slate-500">Tower maintenance & monitoring</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <SensorPanel sensorData={sensorData} connected={connected} />
        <Recommendations pods={pods} speciesDb={speciesDb} />
        <PodGrid pods={pods} onPodClick={setSelectedPod} />
      </main>

      {selectedPod && (
        <PodModal
          pod={selectedPod}
          speciesDb={speciesDb}
          onClose={() => setSelectedPod(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
