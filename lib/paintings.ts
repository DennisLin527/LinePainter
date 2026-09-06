// Game data + equation helpers for "Line Painter".
//
// A painting is an ordered list of curve segments. Each segment is drawn by
// choosing the correct equation from a set of options. Segments come in several
// flavours: straight lines (`y = m·x + b`), vertical lines (`x = c`),
// parabolas (`y = a·x² + b·x + c`), absolute-value lines (`y = a·|x| + k`),
// circles (`(x - h)² + (y - k)² = r²`) and ellipses (`x²/a² + y²/b² = 1`).

export type Segment =
  | { id: string; kind: 'linear'; m: number; b: number; from: number; to: number; color: string }
  | { id: string; kind: 'vertical'; x: number; from: number; to: number; color: string }
  | { id: string; kind: 'parabola'; a: number; b: number; c: number; from: number; to: number; color: string }
  | { id: string; kind: 'abs'; a: number; k: number; from: number; to: number; color: string }
  | { id: string; kind: 'circle'; h: number; k: number; r2: number; color: string }
  | { id: string; kind: 'ellipse'; a2: number; b2: number; h?: number; k?: number; color: string }

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Painting = {
  id: string
  name: string
  hint: string
  difficulty: Difficulty
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
    difficulty: 'Easy',
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
    difficulty: 'Easy',
    segments: [
      { id: 'ground', kind: 'linear', m: 0, b: -4, from: -8, to: 8, color: GREEN },
      { id: 'm1-up', kind: 'linear', m: 2, b: 8, from: -6, to: -3, color: PURPLE },
      { id: 'm1-down', kind: 'linear', m: -2, b: -4, from: -3, to: 0, color: PURPLE },
      { id: 'm2-up', kind: 'linear', m: 2, b: -4, from: 0, to: 4, color: ORANGE },
      { id: 'm2-down', kind: 'linear', m: -2, b: 12, from: 4, to: 8, color: ORANGE },
    ],
  },
  {
    id: 'envelope',
    name: 'The Envelope',
    hint: 'A sealed letter — a rectangle with a folded triangular flap.',
    difficulty: 'Easy',
    segments: [
      { id: 'bottom', kind: 'linear', m: 0, b: -2, from: -4, to: 4, color: BLUE },
      { id: 'left', kind: 'vertical', x: -4, from: -2, to: 2, color: BLUE },
      { id: 'right', kind: 'vertical', x: 4, from: -2, to: 2, color: BLUE },
      { id: 'top', kind: 'linear', m: 0, b: 2, from: -4, to: 4, color: BLUE },
      { id: 'flap-l', kind: 'linear', m: -1, b: -2, from: -4, to: 0, color: RED },
      { id: 'flap-r', kind: 'linear', m: 1, b: -2, from: 0, to: 4, color: RED },
    ],
  },
  {
    id: 'sailboat',
    name: 'The Sailboat',
    hint: 'A hull on the water with a tall triangular sail.',
    difficulty: 'Medium',
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
  {
    id: 'rocket',
    name: 'The Rocket',
    hint: 'A capsule with a pointed nose and two angled fins.',
    difficulty: 'Medium',
    segments: [
      { id: 'body-l', kind: 'vertical', x: -2, from: -3, to: 3, color: BLUE },
      { id: 'body-r', kind: 'vertical', x: 2, from: -3, to: 3, color: BLUE },
      { id: 'nose-l', kind: 'linear', m: 1, b: 5, from: -2, to: 0, color: RED },
      { id: 'nose-r', kind: 'linear', m: -1, b: 5, from: 0, to: 2, color: RED },
      { id: 'fin-l', kind: 'linear', m: 1, b: -1, from: -4, to: -2, color: ORANGE },
      { id: 'fin-r', kind: 'linear', m: -1, b: -1, from: 2, to: 4, color: ORANGE },
      { id: 'base', kind: 'linear', m: 0, b: -3, from: -2, to: 2, color: YELLOW },
    ],
  },
  {
    id: 'diamond',
    name: 'The Diamond',
    hint: 'A gem with four facets and a cross through the center.',
    difficulty: 'Medium',
    segments: [
      { id: 'top-l', kind: 'linear', m: 1, b: 4, from: -4, to: 0, color: PURPLE },
      { id: 'top-r', kind: 'linear', m: -1, b: 4, from: 0, to: 4, color: PURPLE },
      { id: 'bot-l', kind: 'linear', m: -1, b: -4, from: -4, to: 0, color: GREEN },
      { id: 'bot-r', kind: 'linear', m: 1, b: -4, from: 0, to: 4, color: GREEN },
      { id: 'cross-v', kind: 'vertical', x: 0, from: -4, to: 4, color: YELLOW },
      { id: 'cross-h', kind: 'linear', m: 0, b: 0, from: -4, to: 4, color: YELLOW },
    ],
  },
  {
    id: 'crown',
    name: 'The Crown',
    hint: 'Three sharp points on a royal band — mind the steep slopes.',
    difficulty: 'Medium',
    segments: [
      { id: 'base', kind: 'linear', m: 0, b: -2, from: -6, to: 6, color: YELLOW },
      { id: 'side-l', kind: 'vertical', x: -6, from: -2, to: 2, color: YELLOW },
      { id: 'side-r', kind: 'vertical', x: 6, from: -2, to: 2, color: YELLOW },
      { id: 's1-up', kind: 'linear', m: 2, b: 14, from: -6, to: -4, color: PURPLE },
      { id: 's1-dn', kind: 'linear', m: -2, b: -2, from: -4, to: -2, color: PURPLE },
      { id: 's2-up', kind: 'linear', m: 2, b: 6, from: -2, to: 0, color: RED },
      { id: 's2-dn', kind: 'linear', m: -2, b: 6, from: 0, to: 2, color: RED },
      { id: 's3-up', kind: 'linear', m: 2, b: -2, from: 2, to: 4, color: PURPLE },
      { id: 's3-dn', kind: 'linear', m: -2, b: 14, from: 4, to: 6, color: PURPLE },
    ],
  },
  {
    id: 'house-door',
    name: 'House with a Door',
    hint: 'A cabin with a peaked roof — the roof is an absolute-value line.',
    difficulty: 'Medium',
    segments: [
      { id: 'floor', kind: 'linear', m: 0, b: -3, from: -4, to: 4, color: GREEN },
      { id: 'wall-l', kind: 'vertical', x: -4, from: -3, to: 3, color: BLUE },
      { id: 'wall-r', kind: 'vertical', x: 4, from: -3, to: 3, color: BLUE },
      { id: 'eave', kind: 'linear', m: 0, b: 3, from: -4, to: 4, color: BLUE },
      { id: 'roof', kind: 'abs', a: -1, k: 7, from: -4, to: 4, color: RED },
      { id: 'door-l', kind: 'vertical', x: -1, from: -3, to: 0, color: ORANGE },
      { id: 'door-r', kind: 'vertical', x: 1, from: -3, to: 0, color: ORANGE },
      { id: 'door-top', kind: 'linear', m: 0, b: 0, from: -1, to: 1, color: ORANGE },
    ],
  },
  {
    id: 'smiley',
    name: 'Smiley Face',
    hint: 'A big round face, two eyes and a curved smile.',
    difficulty: 'Hard',
    segments: [
      { id: 'face', kind: 'circle', h: 0, k: 0, r2: 25, color: YELLOW },
      { id: 'eye-l', kind: 'circle', h: -2, k: 2, r2: 0.5, color: BLUE },
      { id: 'eye-r', kind: 'circle', h: 2, k: 2, r2: 0.5, color: BLUE },
      { id: 'smile', kind: 'parabola', a: 0.15, b: 0, c: -2.5, from: -3, to: 3, color: RED },
    ],
  },
  {
    id: 'car',
    name: 'The Car',
    hint: 'A body with a slanted cabin and two round wheels.',
    difficulty: 'Hard',
    segments: [
      { id: 'bottom', kind: 'linear', m: 0, b: -2, from: -5, to: 5, color: BLUE },
      { id: 'top', kind: 'linear', m: 0, b: 1, from: -5, to: 5, color: BLUE },
      { id: 'side-l', kind: 'vertical', x: -5, from: -2, to: 1, color: BLUE },
      { id: 'side-r', kind: 'vertical', x: 5, from: -2, to: 1, color: BLUE },
      { id: 'windshield-l', kind: 'linear', m: 1, b: 5, from: -4, to: -2, color: ORANGE },
      { id: 'roof', kind: 'linear', m: 0, b: 3, from: -2, to: 2, color: ORANGE },
      { id: 'windshield-r', kind: 'linear', m: -1, b: 5, from: 2, to: 4, color: ORANGE },
      { id: 'wheel-r', kind: 'circle', h: 3, k: -2, r2: 1, color: YELLOW },
      { id: 'wheel-l', kind: 'circle', h: -3, k: -2, r2: 1, color: YELLOW },
    ],
  },
  {
    id: 'tree',
    name: 'The Tree',
    hint: 'A boxy trunk under a cluster of round leaves.',
    difficulty: 'Hard',
    segments: [
      { id: 'trunk-l', kind: 'vertical', x: -1, from: -5, to: 0, color: ORANGE },
      { id: 'trunk-r', kind: 'vertical', x: 1, from: -5, to: 0, color: ORANGE },
      { id: 'root', kind: 'linear', m: 0, b: -5, from: -1, to: 1, color: ORANGE },
      { id: 'trunk-top', kind: 'linear', m: 0, b: 0, from: -1, to: 1, color: ORANGE },
      { id: 'leaves-c', kind: 'circle', h: 0, k: 3, r2: 9, color: GREEN },
      { id: 'leaves-r', kind: 'circle', h: 2, k: 2, r2: 6, color: GREEN },
      { id: 'leaves-l', kind: 'circle', h: -2, k: 2, r2: 6, color: GREEN },
    ],
  },
  {
    id: 'fish',
    name: 'The Fish',
    hint: 'An elliptical body, a triangular tail and a tiny eye.',
    difficulty: 'Hard',
    segments: [
      { id: 'body', kind: 'ellipse', a2: 16, b2: 6, color: BLUE },
      { id: 'tail-top', kind: 'linear', m: 1, b: 4, from: -7, to: -4, color: ORANGE },
      { id: 'tail-bot', kind: 'linear', m: -1, b: -4, from: -7, to: -4, color: ORANGE },
      { id: 'eye', kind: 'circle', h: 2, k: 0.5, r2: 0.3, color: YELLOW },
    ],
  },
  {
    id: 'butterfly',
    name: 'The Butterfly',
    hint: 'A center body, four round wings and two antennae.',
    difficulty: 'Hard',
    segments: [
      { id: 'body', kind: 'vertical', x: 0, from: -4, to: 4, color: PURPLE },
      { id: 'wing-ur', kind: 'circle', h: 3, k: 2, r2: 9, color: PINK },
      { id: 'wing-ul', kind: 'circle', h: -3, k: 2, r2: 9, color: PINK },
      { id: 'wing-lr', kind: 'circle', h: 2, k: -2, r2: 4, color: BLUE },
      { id: 'wing-ll', kind: 'circle', h: -2, k: -2, r2: 4, color: BLUE },
      { id: 'antenna-r', kind: 'linear', m: 1, b: 4, from: 0, to: 2, color: YELLOW },
      { id: 'antenna-l', kind: 'linear', m: -1, b: 4, from: -2, to: 0, color: YELLOW },
    ],
  },
]

// Sample a segment into a list of graph-coordinate points, plus whether the
// path is closed (circles/ellipses). The graph renders every segment kind from
// this single representation, so lines, parabolas and conics all share one
// drawing + animation path.
export function sampleSegment(seg: Segment): { pts: { x: number; y: number }[]; closed: boolean } {
  switch (seg.kind) {
    case 'linear':
      return {
        pts: [
          { x: seg.from, y: seg.m * seg.from + seg.b },
          { x: seg.to, y: seg.m * seg.to + seg.b },
        ],
        closed: false,
      }
    case 'vertical':
      return { pts: [{ x: seg.x, y: seg.from }, { x: seg.x, y: seg.to }], closed: false }
    case 'parabola': {
      const N = 48
      const pts = []
      for (let i = 0; i <= N; i++) {
        const x = seg.from + ((seg.to - seg.from) * i) / N
        pts.push({ x, y: seg.a * x * x + seg.b * x + seg.c })
      }
      return { pts, closed: false }
    }
    case 'abs': {
      const xs = [seg.from]
      if (seg.from < 0 && seg.to > 0) xs.push(0) // include the vertex
      xs.push(seg.to)
      return { pts: xs.map((x) => ({ x, y: seg.a * Math.abs(x) + seg.k })), closed: false }
    }
    case 'circle': {
      const N = 72
      const r = Math.sqrt(seg.r2)
      const pts = []
      for (let i = 0; i <= N; i++) {
        const t = (2 * Math.PI * i) / N
        pts.push({ x: seg.h + r * Math.cos(t), y: seg.k + r * Math.sin(t) })
      }
      return { pts, closed: true }
    }
    case 'ellipse': {
      const N = 72
      const a = Math.sqrt(seg.a2)
      const b = Math.sqrt(seg.b2)
      const h = seg.h ?? 0
      const k = seg.k ?? 0
      const pts = []
      for (let i = 0; i <= N; i++) {
        const t = (2 * Math.PI * i) / N
        pts.push({ x: h + a * Math.cos(t), y: k + b * Math.sin(t) })
      }
      return { pts, closed: true }
    }
  }
}

// ---- Equation label formatting -------------------------------------------

function formatLinear(m: number, b: number): string {
  if (m === 0) return `y = ${b}`
  const slope = m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`
  if (b === 0) return `y = ${slope}`
  return `y = ${slope} ${b > 0 ? '+' : '-'} ${Math.abs(b)}`
}

function formatParabola(a: number, b: number, c: number): string {
  const aStr = a === 1 ? 'x²' : a === -1 ? '-x²' : `${a}x²`
  let out = `y = ${aStr}`
  if (b !== 0) out += ` ${b > 0 ? '+' : '-'} ${Math.abs(b) === 1 ? 'x' : `${Math.abs(b)}x`}`
  if (c !== 0) out += ` ${c > 0 ? '+' : '-'} ${Math.abs(c)}`
  return out
}

function formatAbs(a: number, k: number): string {
  const aStr = a === 1 ? '|x|' : a === -1 ? '-|x|' : `${a}|x|`
  let out = `y = ${aStr}`
  if (k !== 0) out += ` ${k > 0 ? '+' : '-'} ${Math.abs(k)}`
  return out
}

function squareTerm(v: 'x' | 'y', center: number): string {
  if (center === 0) return `${v}²`
  return `(${v} ${center > 0 ? '-' : '+'} ${Math.abs(center)})²`
}

function formatCircle(h: number, k: number, r2: number): string {
  return `${squareTerm('x', h)} + ${squareTerm('y', k)} = ${r2}`
}

function formatEllipse(a2: number, b2: number): string {
  return `x²/${a2} + y²/${b2} = 1`
}

// Human-readable equation for a segment.
export function equationLabel(seg: Segment): string {
  switch (seg.kind) {
    case 'linear':
      return formatLinear(seg.m, seg.b)
    case 'vertical':
      return `x = ${seg.x}`
    case 'parabola':
      return formatParabola(seg.a, seg.b, seg.c)
    case 'abs':
      return formatAbs(seg.a, seg.k)
    case 'circle':
      return formatCircle(seg.h, seg.k, seg.r2)
    case 'ellipse':
      return formatEllipse(seg.a2, seg.b2)
  }
}

// ---- Option / distractor generation --------------------------------------

// Build a shuffled set of `count` equation options for a segment: the correct
// one plus plausible, same-family distractors.
export function buildOptions(seg: Segment, count = 4): { label: string; correct: boolean }[] {
  const correct = equationLabel(seg)
  const distractors = new Set<string>()

  switch (seg.kind) {
    case 'vertical': {
      for (const d of [1, -1, 2, -2, 3, -3]) distractors.add(`x = ${seg.x + d}`)
      distractors.add(`y = ${seg.x}`)
      break
    }
    case 'linear': {
      const mVariants = [seg.m, -seg.m, seg.m + 1, seg.m - 1, seg.m + 2, seg.m - 2]
      const bVariants = [seg.b, -seg.b, seg.b + 1, seg.b - 1, seg.b + 2, seg.b - 2]
      for (const m of mVariants) for (const b of bVariants) distractors.add(formatLinear(m, b))
      break
    }
    case 'parabola': {
      for (const [a, b, c] of [
        [-seg.a, seg.b, seg.c],
        [seg.a, seg.b, -seg.c],
        [seg.a, seg.b, seg.c + 1],
        [seg.a, seg.b, seg.c - 1],
        [-seg.a, seg.b, -seg.c],
        [seg.a * 2, seg.b, seg.c],
      ] as const) {
        distractors.add(formatParabola(a, b, c))
      }
      break
    }
    case 'abs': {
      for (const [a, k] of [
        [-seg.a, seg.k],
        [seg.a, -seg.k],
        [seg.a, seg.k + 1],
        [seg.a, seg.k - 1],
        [-seg.a, -seg.k],
        [seg.a * 2, seg.k],
      ] as const) {
        distractors.add(formatAbs(a, k))
      }
      break
    }
    case 'circle': {
      const radii = [seg.r2 + 1, seg.r2 + 2, seg.r2 * 2, Math.max(0.5, seg.r2 - 1)]
      for (const r of radii) distractors.add(formatCircle(seg.h, seg.k, r))
      distractors.add(formatCircle(seg.h + 1, seg.k, seg.r2))
      distractors.add(formatCircle(seg.h - 1, seg.k, seg.r2))
      distractors.add(formatCircle(seg.h, seg.k + 1, seg.r2))
      distractors.add(formatCircle(seg.h, seg.k - 1, seg.r2))
      if (seg.h !== 0) distractors.add(formatCircle(-seg.h, seg.k, seg.r2))
      if (seg.k !== 0) distractors.add(formatCircle(seg.h, -seg.k, seg.r2))
      break
    }
    case 'ellipse': {
      distractors.add(formatEllipse(seg.a2 + 2, seg.b2))
      distractors.add(formatEllipse(seg.a2, seg.b2 + 2))
      distractors.add(formatEllipse(Math.max(1, seg.a2 - 2), seg.b2))
      distractors.add(formatEllipse(seg.a2, Math.max(1, seg.b2 - 2)))
      if (seg.a2 !== seg.b2) distractors.add(formatEllipse(seg.b2, seg.a2))
      break
    }
  }

  distractors.delete(correct)
  const picks = shuffle([...distractors]).slice(0, Math.max(1, count - 1))
  return shuffle([
    { label: correct, correct: true },
    ...picks.map((label) => ({ label, correct: false })),
  ])
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
