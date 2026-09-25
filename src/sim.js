import { COIN_RADIUS, RADIUS } from './content/balance.js'

export function createSim(course, tuning) {
  const y = course.height(2) + RADIUS
  return {
    x: 2,
    y,
    vx: tuning.minSpeed,
    vy: 0,
    speed: tuning.minSpeed,
    grounded: true,
    orbs: tuning.startOrbs,
    coins: 0,
    hold: false,
    wasHold: false,
    alive: true,
    finished: false,
  }
}

// Slope is dy/dx along +X. Negative slope is downhill.
// Concrete check: slope -1 -> atan is -π/4 -> -sin(angle) is positive -> speed rises.
function clampSpeed(speed, tuning) {
  if (speed < tuning.minSpeed) return tuning.minSpeed
  if (speed > tuning.maxSpeed) return tuning.maxSpeed
  return speed
}

function land(sim, course, tuning, height, hold) {
  sim.grounded = true
  sim.y = height + RADIUS
  const slope = course.slope(sim.x)
  const denom = Math.sqrt(1 + slope * slope)
  let speed = (sim.vx + sim.vy * slope) / denom
  if (!hold && sim.vy < -12) speed *= tuning.hardLand
  sim.speed = clampSpeed(speed, tuning)
  sim.vx = sim.speed / denom
  sim.vy = sim.vx * slope
}

export function stepSim(sim, course, tuning, dt) {
  const events = []
  if (!sim.alive || sim.finished) return events

  const prevX = sim.x
  const hold = sim.hold
  const released = sim.wasHold && !hold

  if (sim.grounded && released) {
    const slope = course.slope(sim.x)
    sim.grounded = false
    if (slope > 0.02) {
      sim.vy += tuning.launchPop + Math.min(slope, 1.2) * 1.6
      if (sim.vy > 22) sim.vy = 22
      events.push({ type: 'launch' })
    }
  }

  if (sim.grounded) {
    const slope = course.slope(sim.x)
    const angle = Math.atan(slope)
    sim.speed += -Math.sin(angle) * tuning.grip * dt
    if (hold) sim.speed += tuning.holdBoost * dt
    else sim.speed -= tuning.coastDrag * dt
    sim.speed = clampSpeed(sim.speed, tuning)
    sim.x += sim.speed * dt
    const height = course.height(sim.x)
    const denom = Math.sqrt(1 + slope * slope)
    sim.vx = sim.speed / denom
    sim.vy = sim.vx * slope
    if (height == null) sim.grounded = false
    else sim.y = height + RADIUS
  } else {
    sim.vy -= (hold ? tuning.diveGravity : tuning.airGravity) * dt
    sim.x += sim.vx * dt
    sim.y += sim.vy * dt
    const height = course.height(sim.x)
    if (height != null && sim.y <= height + RADIUS) {
      land(sim, course, tuning, height, hold)
    }
  }

  if (sim.x >= course.finishX && sim.y > tuning.killY) {
    sim.finished = true
    sim.wasHold = hold
    events.push({ type: 'finish' })
    return events
  }

  if (sim.y < tuning.killY) {
    sim.alive = false
    sim.wasHold = hold
    events.push({ type: 'die' })
    return events
  }

  for (const gate of course.gates) {
    if (gate.fired || prevX >= gate.x || sim.x < gate.x) continue
    gate.fired = true
    if (sim.y < gate.y0 || sim.y > gate.y1) continue
    gate.hit = true
    if (gate.kind === 'add') sim.orbs += gate.amount
    else if (gate.kind === 'multiply') sim.orbs *= gate.amount
    else sim.orbs -= gate.amount
    if (sim.orbs > 999) sim.orbs = 999
    events.push({ type: 'gate', gate, orbs: sim.orbs })
    if (sim.orbs <= 0) {
      sim.orbs = 0
      sim.alive = false
      events.push({ type: 'die' })
      break
    }
  }

  const reach = RADIUS + COIN_RADIUS
  for (const coin of course.coins) {
    if (coin.got) continue
    const dx = sim.x - coin.x
    const dy = sim.y - coin.y
    if (dx * dx + dy * dy > reach * reach) continue
    coin.got = true
    sim.coins += 1
    events.push({ type: 'coin', coin })
  }

  sim.wasHold = hold
  return events
}
