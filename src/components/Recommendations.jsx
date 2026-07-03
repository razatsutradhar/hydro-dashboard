import { AlertTriangle, CheckCircle } from 'lucide-react'

function computeRecs(pods, speciesDb) {
  const activeSpecies = [...new Set(pods.map(p => p.species).filter(Boolean))]
  if (activeSpecies.length === 0) return null

  const data = activeSpecies.map(s => speciesDb[s]).filter(Boolean)
  if (data.length === 0) return null

  const params = ['ph', 'ec', 'temp_f']
  const results = {}

  for (const param of params) {
    const overlapMin = Math.max(...data.map(d => d[param][0]))
    const overlapMax = Math.min(...data.map(d => d[param][1]))
    const conflict = overlapMin > overlapMax
    results[param] = {
      conflict,
      min: conflict ? null : overlapMin,
      max: conflict ? null : overlapMax,
      target: conflict ? null : +((overlapMin + overlapMax) / 2).toFixed(2),
      individualRanges: data.map((d, i) => ({ species: activeSpecies[i], range: d[param] }))
    }
  }

  return results
}

export default function Recommendations({ pods, speciesDb }) {
  const recs = computeRecs(pods, speciesDb)

  if (!recs) {
    return (
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100 mb-2">Recommendations</h2>
        <p className="text-sm text-slate-500">Assign plants to pods to see recommendations.</p>
      </div>
    )
  }

  const labels = { ph: 'pH', ec: 'EC (mS/cm)', temp_f: 'Water Temp (°F)' }
  const anyConflict = Object.values(recs).some(r => r.conflict)

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Recommendations</h2>
        {anyConflict
          ? <AlertTriangle size={16} className="text-yellow-400" />
          : <CheckCircle size={16} className="text-green-400" />
        }
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(recs).map(([param, r]) => (
          <div key={param} className={`rounded-lg p-3 border ${r.conflict ? 'border-yellow-700 bg-yellow-900/20' : 'border-slate-700 bg-slate-900'}`}>
            <p className="text-xs text-slate-400 mb-1">{labels[param]}</p>
            {r.conflict ? (
              <div>
                <p className="text-yellow-400 font-semibold text-sm">Conflict</p>
                <p className="text-xs text-slate-500 mt-1">Species ranges don't overlap</p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-teal-400">{r.target}</p>
                <p className="text-xs text-slate-500">range {r.min}–{r.max}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {anyConflict && (
        <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-300 font-semibold mb-1">Conflicting species detected:</p>
          {Object.entries(recs).filter(([, r]) => r.conflict).map(([param, r]) => (
            <p key={param} className="text-xs text-slate-400">
              {labels[param]}: {r.individualRanges.map(x => `${x.species} (${x.range[0]}–${x.range[1]})`).join(' vs ')}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
