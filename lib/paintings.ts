// Game data + equation helpers for "Line Painter".
//
// A painting is an ordered list of line segments. Each segment is drawn by
// choosing the correct equation from a set of options. Segments are either a
// linear function `y = m·x + b` restricted to an x-range, or a vertical line
// `x = c` restricted to a y-range (vertical lines are not functions of x).

export type Segment =
  | {
      id: string
      kind: 'linear'
      m: number
      b: number
      from: number // x start
      to: number // x end
      color: string // a Primer color token
    }
  | {
      id: string
      kind: 'vertical'
      x: number
      from: number // y start
      to: number // y end
      color: string
    }

export type Painting = {
  id: string
  name: string
  hint: string
  segments: Segment[]
}

// Primer functional color tokens used as the painting palette.
const BLUE = 'var(--fgColor-accent)'
const GREEN = 'var(--fgColor-success)'
const RED = 'var(--fgColor-danger)'
const YELLOW = 'var(--fgColor-attention)'
const PURPLE = 'var(--fgColor-done)'
const ORANGE = 'var(--fgColor-severe)'
const PINK = 'var(--fgColor-sponsors)'

export const paintings: Painting[] = [
  {
    id: 'house',
    name: 'The Little House',
    hint: 'Four walls and a pointed roof.',
    segments: [
      { id: 'floor', kind: 'linear', m: 0, b: -3, from: -4, to: 4, color: GREEN },
      { id: 'wall-l', kind: 'vertical', x: -4, from: -3, to: 3, color: BLUE },
      { id: 'wall-r', kind: 'vertical', x: 4, from: -3, to: 3, color: BLUE },
      { id: 'top', kind: 'linear', m: 0, b: 3, from: -4, to: 4, color: BLUE },
      { id: 'roof-l', kind: 'linear', m: 1, b: 7, from: -4, to: 0, color: RED },
      { id: 'roof-r', kind: 'linear', m: -1, b: 7, from: 0, to: 4, color: RED },
    ],
  },
  {
    id: 'mountains',
    name: 'Twin Peaks',
    hint: 'Two mountains rising from the valley floor.',
    segments: [
      { id: 'ground', kind: 'linear', m: 0, b: -4, from: -8, to: 8, color: GREEN },
      { id: 'm1-up', kind: 'linear', m: 2, b: 8, from: -6, to: -3, color: PURPLE },
      { id: 'm1-down', kind: 'linear', m: -2, b: -4, from: -3, to: 0, color: PURPLE },
      { id: 'm2-up', kind: 'linear', m: 2, b: -4, from: 0, to: 4, color: ORANGE },
      { id: 'm2-down', kind: 'linear', m: -2, b: 12, from: 4, to: 8, color: ORANGE },
    ],
  },
  {
    id: 'sailboat',
    name: 'The Sailboat',
    hint: 'A hull on the water with a tall triangular sail.',
    segments: [
      { id: 'water', kind: 'linear', m: 0, b: -4, from: -9, to: 9, color: BLUE },
      { id: 'deck', kind: 'linear', m: 0, b: -2, from: -5, to: 5, color: ORANGE },
      { id: 'hull-l', kind: 'linear', m: -2, b: -12, from: -5, to: -4, color: ORANGE },
      { id: 'hull-r', kind: 'linear', m: 2, b: -12, from: 4, to: 5, color: ORANGE },
      { id: 'hull-b', kind: 'linear', m: 0, b: -4, from: -4, to: 4, color: ORANGE },
      { id: 'mast', kind: 'vertical', x: 0, from: -2, to: 6, color: YELLOW },
      { id: 'sail', kind: 'linear', m: -2, b: 6, from: 0, to: 4, color: PINK },
    ],
  },
]

// Evaluate a segment's endpoints in graph coordinates.
export function segmentPoints(seg: Segment): {
  x1: number
  y1: number
  x2: number
  y2: number
} {
  if (seg.kind === 'vertical') {
    return { x1: seg.x, y1: seg.from, x2: seg.x, y2: seg.to }
  }
  return {
    x1: seg.from,
    y1: seg.m * seg.from + seg.b,
    x2: seg.to,
    y2: seg.m * seg.to + seg.b,
  }
}

// Human-readable equation for a segment.
export function equationLabel(seg: Segment): string {
  if (seg.kind === 'vertical') return `x = ${seg.x}`
  return formatLinear(seg.m, seg.b)
}

function formatLinear(m: number, b: number): string {
  if (m === 0) return `y = ${b}`
  const slope = m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`
  if (b === 0) return `y = ${slope}`
  return `y = ${slope} ${b > 0 ? '+' : '-'} ${Math.abs(b)}`
}

// Build a shuffled set of 4 equation options for a segment: the correct one
// plus three plausible distractors.
export function buildOptions(seg: Segment): { label: string; correct: boolean }[] {
  const correct = equationLabel(seg)
  const distractors = new Set<string>()

  if (seg.kind === 'vertical') {
    for (const d of [1, -1, 2, -2, 3]) {
      distractors.add(`x = ${seg.x + d}`)
    }
    // A tempting "y =" style wrong answer.
    distractors.add(`y = ${seg.x}`)
  } else {
    const mVariants = [seg.m, -seg.m, seg.m + 1, seg.m - 1, seg.m + 2]
    const bVariants = [seg.b, -seg.b, seg.b + 1, seg.b - 1, seg.b + 2, seg.b - 2]
    for (const m of mVariants) {
      for (const b of bVariants) {
        distractors.add(formatLinear(m, b))
      }
    }
  }

  distractors.delete(correct)
  const picks = shuffle([...distractors]).slice(0, 3)
  const options = shuffle([
    { label: correct, correct: true },
    ...picks.map((label) => ({ label, correct: false })),
  ])
  return options
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
