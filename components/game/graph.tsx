'use client'

import { segmentPoints, type Segment } from '@/lib/paintings'

const MIN = -10
const MAX = 10
const SIZE = 560
const PAD = 24
const SCALE = (SIZE - PAD * 2) / (MAX - MIN)

function toX(x: number) {
  return PAD + (x - MIN) * SCALE
}
function toY(y: number) {
  return PAD + (MAX - y) * SCALE
}

type GraphProps = {
  drawn: Segment[]
  target?: Segment
  // A wrong line the player just picked, shown briefly in red.
  wrongLine?: { x1: number; y1: number; x2: number; y2: number } | null
}

export function Graph({ drawn, target, wrongLine }: GraphProps) {
  const gridLines = []
  for (let v = MIN; v <= MAX; v++) {
    const strong = v % 5 === 0
    gridLines.push(
      <line
        key={`v${v}`}
        x1={toX(v)}
        y1={toY(MIN)}
        x2={toX(v)}
        y2={toY(MAX)}
        stroke={strong ? 'var(--borderColor-default)' : 'var(--borderColor-muted)'}
        strokeWidth={strong ? 1 : 0.5}
      />,
      <line
        key={`h${v}`}
        x1={toX(MIN)}
        y1={toY(v)}
        x2={toX(MAX)}
        y2={toY(v)}
        stroke={strong ? 'var(--borderColor-default)' : 'var(--borderColor-muted)'}
        strokeWidth={strong ? 1 : 0.5}
      />,
    )
  }

  const axisLabels = []
  for (let v = MIN; v <= MAX; v += 5) {
    if (v !== 0) {
      axisLabels.push(
        <text
          key={`lx${v}`}
          x={toX(v)}
          y={toY(0) + 14}
          fontSize={10}
          textAnchor="middle"
          fill="var(--fgColor-muted)"
        >
          {v}
        </text>,
        <text
          key={`ly${v}`}
          x={toX(0) - 8}
          y={toY(v) + 3}
          fontSize={10}
          textAnchor="end"
          fill="var(--fgColor-muted)"
        >
          {v}
        </text>,
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      role="img"
      aria-label="Coordinate grid showing the painting being drawn"
      style={{
        display: 'block',
        borderRadius: 'var(--borderRadius-medium)',
        border: 'var(--borderWidth-thin) solid var(--borderColor-default)',
        background: 'var(--bgColor-inset)',
        maxWidth: 560,
      }}
    >
      {gridLines}

      {/* Axes */}
      <line x1={toX(MIN)} y1={toY(0)} x2={toX(MAX)} y2={toY(0)} stroke="var(--fgColor-muted)" strokeWidth={1.5} />
      <line x1={toX(0)} y1={toY(MIN)} x2={toX(0)} y2={toY(MAX)} stroke="var(--fgColor-muted)" strokeWidth={1.5} />
      {axisLabels}

      {/* Ghost target line the player is trying to match */}
      {target &&
        (() => {
          const p = segmentPoints(target)
          return (
            <line
              x1={toX(p.x1)}
              y1={toY(p.y1)}
              x2={toX(p.x2)}
              y2={toY(p.y2)}
              stroke="var(--fgColor-muted)"
              strokeWidth={3}
              strokeDasharray="6 6"
              strokeLinecap="round"
              opacity={0.7}
            />
          )
        })()}

      {/* Already drawn segments */}
      {drawn.map((seg) => {
        const p = segmentPoints(seg)
        const len = Math.hypot(toX(p.x2) - toX(p.x1), toY(p.y2) - toY(p.y1))
        return (
          <line
            key={seg.id}
            x1={toX(p.x1)}
            y1={toY(p.y1)}
            x2={toX(p.x2)}
            y2={toY(p.y2)}
            stroke={seg.color}
            strokeWidth={4}
            strokeLinecap="round"
            style={{
              strokeDasharray: len,
              strokeDashoffset: 0,
              animation: 'lp-draw 500ms ease-out',
            }}
          />
        )
      })}

      {/* A wrong pick, flashed in red */}
      {wrongLine && (
        <line
          x1={toX(wrongLine.x1)}
          y1={toY(wrongLine.y1)}
          x2={toX(wrongLine.x2)}
          y2={toY(wrongLine.y2)}
          stroke="var(--fgColor-danger)"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.8}
        />
      )}

      <style>{`
        @keyframes lp-draw {
          from { stroke-dashoffset: var(--lp-len, 600); opacity: 0.2; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </svg>
  )
}
