import { Sprout, Plus } from 'lucide-react'

export default function PodGrid({ pods, onPodClick }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-100 mb-3">Tower Pods</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pods.map(pod => (
          <PodCard key={pod.pod_id} pod={pod} onClick={() => onPodClick(pod)} />
        ))}
      </div>
    </div>
  )
}

function PodCard({ pod, onClick }) {
  const occupied = !!pod.species
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all hover:scale-105 active:scale-95 ${
        occupied
          ? 'bg-teal-900/40 border-teal-700 hover:border-teal-500'
          : 'bg-slate-800 border-slate-700 hover:border-slate-500'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 font-mono">Pod {pod.pod_id}</span>
        {occupied
          ? <Sprout size={16} className="text-teal-400" />
          : <Plus size={16} className="text-slate-500" />
        }
      </div>
      {occupied ? (
        <>
          <p className="text-sm font-semibold text-slate-100 leading-tight">{pod.species}</p>
          {pod.planted_at && (
            <p className="text-xs text-slate-500 mt-1">
              Planted {new Date(pod.planted_at).toLocaleDateString()}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500">Empty</p>
      )}
    </button>
  )
}
