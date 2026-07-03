import { Sprout } from 'lucide-react'

const LAYERS = 6
const PODS_PER_LAYER = 3

// Must match TowerView SVG constants for pixel-perfect alignment
const SVG_H = 500
const TOWER_TOP = 30
const TOWER_BOTTOM = 470
const LAYER_H = (TOWER_BOTTOM - TOWER_TOP) / LAYERS  // ~73.33px

export default function PodGrid({ pods, onPodClick }) {
  const layers = Array.from({ length: LAYERS }, (_, i) =>
    pods.slice(i * PODS_PER_LAYER, i * PODS_PER_LAYER + PODS_PER_LAYER)
  )

  return (
    <div style={{ height: SVG_H, display: 'flex', flexDirection: 'column' }}>
      {/* Header row — sits in the same vertical space as the tower's water tube */}
      <div style={{ height: TOWER_TOP, flexShrink: 0 }}
        className="flex items-end pb-1 gap-3">
        <span className="w-10 shrink-0" />
        <div className="grid grid-cols-3 gap-2 flex-1 text-center">
          {['Left', 'Front', 'Right'].map(label => (
            <span key={label} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Layer rows — each row height matches LAYER_H in the SVG */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                    paddingBottom: SVG_H - TOWER_BOTTOM }}>
        {layers.map((layerPods, layerIdx) => (
          <div key={layerIdx}
            style={{ height: LAYER_H, flexShrink: 0 }}
            className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-right text-[10px] font-semibold text-slate-400">
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
      className={`rounded-lg border px-2 py-1.5 text-left text-xs transition-all hover:scale-[1.03] active:scale-95 w-full h-full ${
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
        <p className="font-semibold text-slate-700 truncate leading-tight">{pod.species}</p>
      ) : (
        <p className="text-orange-400 text-[11px]">Empty</p>
      )}
    </button>
  )
}
