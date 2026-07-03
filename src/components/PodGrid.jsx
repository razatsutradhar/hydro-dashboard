import { Sprout } from 'lucide-react'

const LAYERS = 6
const PODS_PER_LAYER = 3

export default function PodGrid({ pods, onPodClick }) {
  const layers = Array.from({ length: LAYERS }, (_, i) =>
    pods.slice(i * PODS_PER_LAYER, i * PODS_PER_LAYER + PODS_PER_LAYER)
  )

  return (
    // pod-grid-container: on md+ gets height:500px matching SVG
    <div className="pod-grid-container flex flex-col flex-1 min-w-0">

      {/* Column headers — pod-grid-header: on md+ gets height:30px matching tower top space */}
      <div className="pod-grid-header flex items-center gap-2 pb-2">
        <span className="w-8 md:w-10 shrink-0" />
        <div className="grid grid-cols-3 gap-2 flex-1 text-center">
          {['Left', 'Front', 'Right'].map(label => (
            <span key={label} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* pod-grid-rows: on md+ gets padding-bottom:30px matching reservoir space */}
      <div className="pod-grid-rows flex flex-col gap-2 md:gap-0 flex-1">
        {layers.map((layerPods, layerIdx) => (
          // pod-row: on md+ gets height:73.33px matching each SVG layer
          <div key={layerIdx} className="pod-row flex items-center gap-2 py-1">
            <span className="w-8 md:w-10 shrink-0 text-right text-[10px] font-semibold text-slate-400">
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
      className={`rounded-lg border px-1.5 py-1.5 text-left text-xs transition-all hover:scale-[1.03] active:scale-95 w-full h-full ${
        occupied
          ? 'bg-green-50 border-green-300 hover:border-green-400'
          : 'bg-orange-50 border-orange-200 hover:border-orange-400'
      }`}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono text-[10px] text-slate-400">#{pod.pod_id}</span>
        {occupied && <Sprout size={10} className="text-green-500" />}
      </div>
      {occupied ? (
        <p className="font-semibold text-slate-700 truncate leading-tight text-[11px]">{pod.species}</p>
      ) : (
        <p className="text-orange-400 text-[11px]">Empty</p>
      )}
    </button>
  )
}
