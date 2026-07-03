import { X, Leaf, Calendar, Lightbulb } from 'lucide-react'
import { useState } from 'react'

export default function PodModal({ pod, speciesDb, onClose, onSave }) {
  const [selectedSpecies, setSelectedSpecies] = useState(pod.species || '')
  const [plantedAt, setPlantedAt] = useState(pod.planted_at || '')
  const [view, setView] = useState('assign') // 'assign' | 'info'

  const speciesList = Object.keys(speciesDb).sort()
  const speciesInfo = speciesDb[selectedSpecies]

  const handleSave = () => {
    onSave(pod.pod_id, selectedSpecies || null, plantedAt || null)
    onClose()
  }

  const handleClear = () => {
    onSave(pod.pod_id, null, null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Pod {pod.pod_id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-700">
          {['assign', 'info'].map(t => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`flex-1 py-2 text-sm capitalize transition-colors ${view === t ? 'text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t === 'assign' ? 'Assign Plant' : 'Species Info'}
            </button>
          ))}
        </div>

        <div className="p-5">
          {view === 'assign' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Species</label>
                <select
                  value={selectedSpecies}
                  onChange={e => setSelectedSpecies(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="">— Empty —</option>
                  {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Date Planted</label>
                <input
                  type="date"
                  value={plantedAt}
                  onChange={e => setPlantedAt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                  Save
                </button>
                {pod.species && (
                  <button onClick={handleClear} className="px-4 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg py-2 text-sm transition-colors">
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {view === 'info' && (
            <div>
              {speciesInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <InfoChip label="pH" value={`${speciesInfo.ph[0]}–${speciesInfo.ph[1]}`} />
                    <InfoChip label="EC" value={`${speciesInfo.ec[0]}–${speciesInfo.ec[1]}`} />
                    <InfoChip label="Temp °F" value={`${speciesInfo.temp_f[0]}–${speciesInfo.temp_f[1]}`} />
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} />
                    <span>~{speciesInfo.growth_days} days to harvest</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-slate-300 font-medium text-sm mb-1">
                      <Leaf size={14} className="text-teal-400" />
                      Growth Info
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{speciesInfo.growth_info}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-slate-300 font-medium text-sm mb-2">
                      <Lightbulb size={14} className="text-yellow-400" />
                      Tips
                    </div>
                    <ul className="space-y-2">
                      {speciesInfo.tips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-400">
                          <span className="text-teal-500 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Select a species in the Assign tab to see its info.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoChip({ label, value }) {
  return (
    <div className="bg-slate-900 rounded-lg p-2 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-teal-400">{value}</p>
    </div>
  )
}
