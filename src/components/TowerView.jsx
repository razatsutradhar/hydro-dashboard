const LAYERS = 6
const PODS_PER_LAYER = 3
const SVG_W = 180
const SVG_H = 500
const TOWER_CX = 90
const TOWER_W = 48
const TOWER_X = TOWER_CX - TOWER_W / 2
const TOWER_TOP = 30
const TOWER_BOTTOM = 470
const TOWER_H = TOWER_BOTTOM - TOWER_TOP
const LAYER_H = TOWER_H / LAYERS
const POD_R = 14

// For each layer, the 3 pod (cx, cy) positions relative to the SVG
// Pod positions: left, front-center (slightly forward = higher y), right
function podPositions(layerIndex) {
  const midY = TOWER_TOP + layerIndex * LAYER_H + LAYER_H / 2
  return [
    { cx: TOWER_CX - 58, cy: midY - 6 },   // left
    { cx: TOWER_CX,      cy: midY + 10 },  // front-center (overlaps tower)
    { cx: TOWER_CX + 58, cy: midY - 6 },   // right
  ]
}

function podColor(pod) {
  if (!pod || !pod.species) return { fill: '#f1f5f9', stroke: '#94a3b8' }
  return { fill: '#dcfce7', stroke: '#22c55e' }
}

export default function TowerView({ pods, onPodClick }) {
  // pods array is flat 1-18, map to layer/position
  const getPod = (layer, pos) => pods[(layer * PODS_PER_LAYER) + pos]

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Tower View</h3>
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="select-none">
        {/* Tower body */}
        <rect
          x={TOWER_X} y={TOWER_TOP}
          width={TOWER_W} height={TOWER_H}
          rx={TOWER_W / 2}
          fill="white" stroke="#cbd5e1" strokeWidth="2"
        />
        {/* Water tube at top */}
        <line x1={TOWER_CX} y1={8} x2={TOWER_CX} y2={TOWER_TOP} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx={TOWER_CX} cy={6} r={4} fill="#94a3b8" />

        {/* Layer divider lines on tower */}
        {Array.from({ length: LAYERS - 1 }, (_, i) => {
          const y = TOWER_TOP + (i + 1) * LAYER_H
          const halfW = Math.sqrt(Math.max(0, (TOWER_W / 2) ** 2 - 0))
          return (
            <line key={i}
              x1={TOWER_X + 4} y1={y}
              x2={TOWER_X + TOWER_W - 4} y2={y}
              stroke="#e2e8f0" strokeWidth="1"
            />
          )
        })}

        {/* Pods and connectors per layer */}
        {Array.from({ length: LAYERS }, (_, layerIdx) => {
          const positions = podPositions(layerIdx)
          return positions.map((pos, posIdx) => {
            const pod = getPod(layerIdx, posIdx)
            const { fill, stroke } = podColor(pod)
            const podId = pod?.pod_id
            const occupied = pod?.species

            // Connector line from pod edge to tower edge
            const isLeft = posIdx === 0
            const isRight = posIdx === 2
            const lineEnd = isLeft
              ? { x: TOWER_X + 2, y: pos.cy }
              : isRight
              ? { x: TOWER_X + TOWER_W - 2, y: pos.cy }
              : null

            return (
              <g key={posIdx} style={{ cursor: 'pointer' }} onClick={() => pod && onPodClick(pod)}>
                {lineEnd && (
                  <line
                    x1={pos.cx + (isLeft ? POD_R : -POD_R)} y1={pos.cy}
                    x2={lineEnd.x} y2={lineEnd.y}
                    stroke="#cbd5e1" strokeWidth="1.5"
                  />
                )}
                <circle
                  cx={pos.cx} cy={pos.cy} r={POD_R}
                  fill={fill} stroke={stroke} strokeWidth="2"
                />
                <text
                  x={pos.cx} y={pos.cy + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight="600"
                  fill={occupied ? '#16a34a' : '#94a3b8'}
                >
                  {podId}
                </text>
              </g>
            )
          })
        })}

        {/* Layer labels */}
        {Array.from({ length: LAYERS }, (_, i) => {
          const y = TOWER_TOP + i * LAYER_H + LAYER_H / 2
          return (
            <text key={i} x={SVG_W - 4} y={y + 1}
              textAnchor="end" dominantBaseline="middle"
              fontSize="9" fill="#94a3b8" fontWeight="500"
            >
              L{i + 1}
            </text>
          )
        })}

        {/* Reservoir bucket at bottom */}
        <rect
          x={TOWER_X - 8} y={TOWER_BOTTOM}
          width={TOWER_W + 16} height={24}
          rx={4}
          fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"
        />
        <text x={TOWER_CX} y={TOWER_BOTTOM + 12}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="8" fill="#94a3b8"
        >reservoir</text>
      </svg>
    </div>
  )
}
