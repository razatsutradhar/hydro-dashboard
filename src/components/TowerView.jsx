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

function podPositions(layerIndex) {
  const midY = TOWER_TOP + layerIndex * LAYER_H + LAYER_H / 2
  return [
    { cx: TOWER_CX - 58, cy: midY - 6 },   // left
    { cx: TOWER_CX,      cy: midY + 10 },   // front-center
    { cx: TOWER_CX + 58, cy: midY - 6 },    // right
  ]
}

function podColor(pod) {
  if (!pod || !pod.species) return { fill: '#fff7ed', stroke: '#f97316' }  // orange — empty
  return { fill: '#dcfce7', stroke: '#22c55e' }                            // green — planted
}

export default function TowerView({ pods, onPodClick }) {
  const getPod = (layer, pos) => pods[layer * PODS_PER_LAYER + pos]

  return (
    <div className="flex flex-col items-center">
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="select-none">
        {/* Water tube */}
        <line x1={TOWER_CX} y1={8} x2={TOWER_CX} y2={TOWER_TOP} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx={TOWER_CX} cy={6} r={4} fill="#94a3b8" />

        {/* Tower body */}
        <rect
          x={TOWER_X} y={TOWER_TOP}
          width={TOWER_W} height={TOWER_H}
          rx={TOWER_W / 2}
          fill="white" stroke="#cbd5e1" strokeWidth="2"
        />

        {/* Layer dividers */}
        {Array.from({ length: LAYERS - 1 }, (_, i) => (
          <line key={i}
            x1={TOWER_X + 5} y1={TOWER_TOP + (i + 1) * LAYER_H}
            x2={TOWER_X + TOWER_W - 5} y2={TOWER_TOP + (i + 1) * LAYER_H}
            stroke="#e2e8f0" strokeWidth="1"
          />
        ))}

        {/* Pods */}
        {Array.from({ length: LAYERS }, (_, layerIdx) => {
          const positions = podPositions(layerIdx)
          return positions.map((pos, posIdx) => {
            const pod = getPod(layerIdx, posIdx)
            const { fill, stroke } = podColor(pod)
            const occupied = pod?.species
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
                <circle cx={pos.cx} cy={pos.cy} r={POD_R} fill={fill} stroke={stroke} strokeWidth="2" />
                <text
                  x={pos.cx} y={pos.cy + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight="600"
                  fill={occupied ? '#16a34a' : '#ea580c'}
                >
                  {pod?.pod_id}
                </text>
              </g>
            )
          })
        })}

        {/* Reservoir */}
        <rect
          x={TOWER_X - 8} y={TOWER_BOTTOM + 2}
          width={TOWER_W + 16} height={22}
          rx={4} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"
        />
        <text x={TOWER_CX} y={TOWER_BOTTOM + 13}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="8" fill="#94a3b8"
        >reservoir</text>
      </svg>
    </div>
  )
}
