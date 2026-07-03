import { useEffect, useState } from 'react'
import { useSocket } from './hooks/useSocket'
import SensorPanel from './components/SensorPanel'
import PodGrid from './components/PodGrid'
import PodModal from './components/PodModal'
import Recommendations from './components/Recommendations'
import TowerView from './components/TowerView'

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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-teal-600">Hydro Dashboard</h1>
            <p className="text-xs text-slate-400">Tower maintenance & monitoring</p>
          </div>
          <div className="text-xs text-slate-400">
            {pods.filter(p => p.species).length} / {pods.length} pods occupied
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Top row: sensor + recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SensorPanel sensorData={sensorData} connected={connected} />
          <Recommendations pods={pods} speciesDb={speciesDb} />
        </div>

        {/* Main row: tower visual + pod grid */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Tower Pods
          </h2>
          <div className="flex gap-6 items-start overflow-x-auto">
            {/* Tower visual */}
            <div className="shrink-0">
              {pods.length > 0 && (
                <TowerView pods={pods} onPodClick={setSelectedPod} />
              )}
            </div>

            {/* 3x6 pod grid */}
            <div className="flex-1 min-w-0">
              {pods.length > 0 && (
                <PodGrid pods={pods} onPodClick={setSelectedPod} />
              )}
            </div>
          </div>
        </div>
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
