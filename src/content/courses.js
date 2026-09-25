// Course layout. Each entry is data: hills, gaps, and arches.
// biome matches an id in src/theme/theme.js.

const courseList = [
  {
    name: 'Warm Ribbon',
    length: 78,
    biome: 'dusk-mesa',
    hills: [
      { amp: 2.15, freq: 0.4, phase: 0.2 },
      { amp: 0.45, freq: 0.82, phase: 1.1 },
    ],
    gaps: [],
    gates: [
      { at: 0.18, lane: 'low', kind: 'add', amount: 3 },
      { at: 0.38, lane: 'low', kind: 'add', amount: 3 },
      { at: 0.58, lane: 'high', kind: 'add', amount: 4 },
      { at: 0.78, lane: 'low', kind: 'multiply', amount: 2 },
    ],
  },
  {
    name: 'Glass Step',
    length: 88,
    biome: 'tide-shelf',
    hills: [
      { amp: 2.3, freq: 0.42, phase: 1.0 },
      { amp: 0.5, freq: 0.86, phase: 0.4 },
    ],
    gaps: [],
    gates: [
      { at: 0.16, lane: 'low', kind: 'add', amount: 3 },
      { at: 0.34, lane: 'high', kind: 'add', amount: 4 },
      { at: 0.52, lane: 'low', kind: 'add', amount: 3 },
      { at: 0.7, lane: 'high', kind: 'multiply', amount: 2 },
      { at: 0.86, lane: 'low', kind: 'add', amount: 4 },
    ],
  },
  {
    name: 'Split Mesa',
    length: 98,
    biome: 'ash-garden',
    hills: [
      { amp: 2.35, freq: 0.4, phase: 0.5 },
      { amp: 0.55, freq: 0.78, phase: 1.4 },
    ],
    gaps: [{ around: 50, width: 4.2 }],
    gates: [
      { at: 0.14, lane: 'low', kind: 'add', amount: 4 },
      { at: 0.32, lane: 'low', kind: 'multiply', amount: 2 },
      { at: 0.5, lane: 'high', kind: 'add', amount: 5 },
      { at: 0.68, lane: 'mid', kind: 'subtract', amount: 3 },
      { at: 0.84, lane: 'low', kind: 'add', amount: 4 },
    ],
  },
  {
    name: 'High Arch',
    length: 104,
    biome: 'night-orchard',
    hills: [
      { amp: 2.45, freq: 0.44, phase: 0.9 },
      { amp: 0.6, freq: 0.8, phase: 2.0 },
    ],
    gaps: [{ around: 48, width: 4.6 }],
    gates: [
      { at: 0.12, lane: 'low', kind: 'add', amount: 3 },
      { at: 0.28, lane: 'high', kind: 'add', amount: 5 },
      { at: 0.46, lane: 'low', kind: 'multiply', amount: 2 },
      { at: 0.64, lane: 'high', kind: 'subtract', amount: 4 },
      { at: 0.82, lane: 'low', kind: 'add', amount: 5 },
    ],
  },
  {
    name: 'Blue Shelf',
    length: 112,
    biome: 'dusk-mesa',
    hills: [
      { amp: 2.5, freq: 0.4, phase: 1.7 },
      { amp: 0.7, freq: 0.74, phase: 0.4 },
    ],
    gaps: [{ around: 42, width: 4.8 }, { around: 74, width: 5 }],
    gates: [
      { at: 0.12, lane: 'low', kind: 'add', amount: 4 },
      { at: 0.28, lane: 'high', kind: 'multiply', amount: 2 },
      { at: 0.44, lane: 'mid', kind: 'subtract', amount: 3 },
      { at: 0.6, lane: 'low', kind: 'add', amount: 4 },
      { at: 0.76, lane: 'high', kind: 'add', amount: 6 },
      { at: 0.9, lane: 'low', kind: 'add', amount: 4 },
    ],
  },
  {
    name: 'Cinder Gap',
    length: 120,
    biome: 'ash-garden',
    hills: [
      { amp: 2.55, freq: 0.43, phase: 0.6 },
      { amp: 0.65, freq: 0.8, phase: 1.5 },
    ],
    gaps: [{ around: 38, width: 5 }, { around: 72, width: 5.2 }, { around: 98, width: 4.8 }],
    gates: [
      { at: 0.1, lane: 'low', kind: 'add', amount: 4 },
      { at: 0.24, lane: 'high', kind: 'add', amount: 5 },
      { at: 0.4, lane: 'low', kind: 'multiply', amount: 2 },
      { at: 0.56, lane: 'mid', kind: 'subtract', amount: 5 },
      { at: 0.72, lane: 'high', kind: 'add', amount: 6 },
      { at: 0.88, lane: 'low', kind: 'multiply', amount: 2 },
    ],
  },
  {
    name: 'Long Fetch',
    length: 128,
    biome: 'tide-shelf',
    hills: [
      { amp: 2.6, freq: 0.4, phase: 2.2 },
      { amp: 0.75, freq: 0.72, phase: 0.7 },
    ],
    gaps: [{ around: 36, width: 5.1 }, { around: 66, width: 5.3 }, { around: 98, width: 5.2 }],
    gates: [
      { at: 0.1, lane: 'low', kind: 'add', amount: 5 },
      { at: 0.22, lane: 'high', kind: 'add', amount: 5 },
      { at: 0.36, lane: 'low', kind: 'add', amount: 4 },
      { at: 0.5, lane: 'mid', kind: 'subtract', amount: 6 },
      { at: 0.64, lane: 'high', kind: 'multiply', amount: 2 },
      { at: 0.78, lane: 'low', kind: 'add', amount: 5 },
      { at: 0.9, lane: 'high', kind: 'subtract', amount: 4 },
    ],
  },
  {
    name: 'Last Basin',
    length: 136,
    biome: 'night-orchard',
    hills: [
      { amp: 2.7, freq: 0.42, phase: 0.4 },
      { amp: 0.8, freq: 0.76, phase: 1.8 },
    ],
    gaps: [
      { around: 34, width: 5.2 },
      { around: 60, width: 5.4 },
      { around: 88, width: 5.5 },
      { around: 114, width: 5.2 },
    ],
    gates: [
      { at: 0.08, lane: 'low', kind: 'add', amount: 4 },
      { at: 0.2, lane: 'high', kind: 'multiply', amount: 2 },
      { at: 0.34, lane: 'low', kind: 'add', amount: 5 },
      { at: 0.48, lane: 'mid', kind: 'subtract', amount: 6 },
      { at: 0.62, lane: 'high', kind: 'add', amount: 6 },
      { at: 0.76, lane: 'low', kind: 'multiply', amount: 2 },
      { at: 0.9, lane: 'mid', kind: 'subtract', amount: 5 },
    ],
  },
]

export const COURSE_COUNT = courseList.length

export function courseMeta(index) {
  const plan = courseList[index]
  return { index, name: plan.name, biome: plan.biome, length: plan.length }
}

export function gateWindow(height, lane) {
  if (lane === 'high') return { y0: height + 0.75, y1: height + 7.5 }
  if (lane === 'mid') return { y0: height + 1.25, y1: height + 3.15 }
  return { y0: height - 0.15, y1: height + 2.45 }
}

function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function rawHeight(plan, x) {
  let y = 0
  for (const hill of plan.hills) {
    y += hill.amp * Math.sin(hill.freq * x + hill.phase)
  }
  if (x < 10) y *= smoothstep(2, 10, x)
  const padStart = plan.length - 14
  if (x > padStart) {
    const t = smoothstep(padStart, plan.length - 5, Math.min(x, plan.length))
    y = y * (1 - t) + (-0.35) * t
  }
  return y
}

function rawSlope(plan, x) {
  const dx = 0.3
  return (rawHeight(plan, x + dx) - rawHeight(plan, x - dx)) / (2 * dx)
}

function launchPoint(plan, x) {
  let best = x
  let bestDistance = Infinity
  for (let point = x - 14; point <= x + 14; point += 0.2) {
    const slope = rawSlope(plan, point)
    const ahead = rawSlope(plan, point + 1.4)
    if (slope <= 0.08 || ahead >= 0) continue
    const distance = Math.abs(point - x)
    if (distance < bestDistance) {
      bestDistance = distance
      best = point
    }
  }
  return best + 3.2
}

function resolveGaps(plan) {
  return plan.gaps.map((gap) => {
    let bestX = gap.around
    let bestSlope = -Infinity
    for (let x = gap.around - 12; x <= gap.around + 8; x += 0.4) {
      const slope = rawSlope(plan, x)
      if (slope > bestSlope) {
        bestSlope = slope
        bestX = x
      }
    }
    const start = bestX + 0.5
    return [start, start + gap.width]
  })
}

export function buildCourse(index) {
  const plan = courseList[index]
  if (!plan) throw new Error(`Unknown course ${index}`)
  const gaps = resolveGaps(plan)
  const finishX = plan.length - 7

  function height(x) {
    for (const [start, end] of gaps) {
      if (x > start && x < end) return null
    }
    return rawHeight(plan, x)
  }

  function slope(x) {
    return rawSlope(plan, x)
  }

  const course = {
    index,
    name: plan.name,
    biome: plan.biome,
    length: plan.length,
    finishX,
    gaps,
    height,
    slope,
    gates: [],
    coins: [],
  }

  const spanStart = 14
  const spanEnd = finishX - 6
  for (const gate of plan.gates) {
    let x = spanStart + gate.at * (spanEnd - spanStart)
    for (const [start, end] of gaps) {
      if (x > start - 2 && x < end + 2) x = end + 2.5
    }
    if (gate.lane === 'high') x = launchPoint(plan, x)
    if (height(x) == null) continue
    course.gates.push({
      x,
      lane: gate.lane,
      kind: gate.kind,
      amount: gate.amount,
      fired: false,
      hit: false,
      h: 0,
      y0: 0,
      y1: 0,
    })
  }
  course.gates.sort((a, b) => a.x - b.x)
  for (let i = 1; i < course.gates.length; i++) {
    if (course.gates[i].x < course.gates[i - 1].x + 4) {
      course.gates[i].x = course.gates[i - 1].x + 4
    }
  }
  course.gates = course.gates.filter((gate) => gate.x < finishX - 2 && height(gate.x) != null)
  for (const gate of course.gates) {
    const h = height(gate.x)
    const window = gateWindow(h, gate.lane)
    gate.h = h
    gate.y0 = window.y0
    gate.y1 = window.y1
  }

  for (let x = 15; x < finishX - 3; x += 6.5) {
    let blocked = false
    for (const [start, end] of gaps) {
      if (x > start - 1 && x < end + 1) blocked = true
    }
    if (blocked || height(x) == null) continue
    course.coins.push({ x, y: height(x) + 1.15, got: false })
  }

  return course
}
