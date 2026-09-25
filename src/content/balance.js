export const RADIUS = 0.32
export const COIN_RADIUS = 0.28
export const FLOCK_COUNT = 28

// Lead at (0, 0, 0) places the camera at (-8, 3.5, 13), looking at (6, 0.6, 0).
// That view faces +X and -Z. Travel along +X moves ahead of the camera.
export const CAMERA = {
  back: 8,
  up: 3.5,
  side: 13,
  lookAhead: 6,
  lookUp: 0.6,
}

export const balance = {
  clearBonusPerOrb: 2,
  upgrades: {
    cluster: {
      max: 5,
      cost(level) { return 30 * (level + 1) },
      startOrbs(level) { return 4 + level * 3 },
    },
    glide: {
      max: 5,
      cost(level) { return 35 * (level + 1) },
    },
    purse: {
      max: 5,
      cost(level) { return 25 * (level + 1) },
      multiplier(level) { return 1 + level * 0.25 },
    },
  },
}

export function tuningFrom(upgrades) {
  const glide = upgrades.glide
  return {
    startOrbs: balance.upgrades.cluster.startOrbs(upgrades.cluster),
    minSpeed: 6.4,
    maxSpeed: 17.5 + glide * 0.7,
    grip: 14,
    holdBoost: 2.4,
    coastDrag: 0.6,
    airGravity: 17 - glide * 0.7,
    diveGravity: 34,
    launchPop: 6.2 + glide * 0.65,
    hardLand: 0.82,
    killY: -8,
    purse: balance.upgrades.purse.multiplier(upgrades.purse),
    clearBonusPerOrb: balance.clearBonusPerOrb,
  }
}
