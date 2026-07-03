import { Sprout } from 'lucide-react'

const LAYERS = 6
const PODS_PER_LAYER = 3

export default function PodGrid({ pods, onPodClick }) {
  const layers = Array.from({ length: LAYERS }, (_, i) =>
    pods.slice(i * PODS_PER_LAYER, i * PODS_PER_LAYER + PODS_PER_LAYER)
  )

  return (
    <div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-3">
        <span className="w-12 text-right">Layer</span>
        <span className="grid grid-cols-3 gap-2 flex-1 text-center">
          <span>Left</span><span>Front</span><span>Right</span>
        </span>
      </div>
      <div className="space-y-2">
        {layers.map((layerPods, layerIdx) => (
          <div key={layerIdx} className="flex items-center gap-3">
            <span className="w-12 text-right text-xs font-semibold text-slate-400 shrink-0">
              L{layerIdx + 1}
            </span>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {layerPods.map(pod => (
                <PodCell key={pod.pod_id} pod={pod} onClick={() => onPodClick(pod)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PodCell({ pod, onClick }) {
  const occupied = !!pod.species
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2 py-2 text-left text-xs transition-all hover:scale-[1.03] active:scale-95 w-full ${
        occupied
          ? 'bg-green-50 border-green-300 hover:border-green-400'
          : 'bg-white border-slate-200 hover:border-slate-400'
      }`}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-slate-400 font-mono text-[10px]">#{pod.pod_id}</span>
        {occupied && <Sprout size={10} className="text-green-500" />}
      </div>
      {occupied ? (
        <p className="font-semibold text-slate-700 truncate leading-tight">{pod.species}</p>
      ) : (
        <p className="text-slate-400">Empty</p>
      )}
    </button>
  )
}
