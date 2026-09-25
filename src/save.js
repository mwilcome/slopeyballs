import { COURSE_COUNT } from './content/courses.js'
import { theme } from './theme/theme.js'

const KEY = 'slopeyballs.save.v1'

function blank() {
  return {
    coins: 0,
    unlocked: 1,
    selected: 0,
    upgrades: { cluster: 0, glide: 0, purse: 0 },
    style: 'glass',
    owned: ['glass'],
    muted: false,
    best: {},
  }
}

function clamp(save) {
  const next = blank()
  next.coins = Math.max(0, Math.floor(Number(save.coins) || 0))
  next.unlocked = Math.min(COURSE_COUNT, Math.max(1, Math.floor(Number(save.unlocked) || 1)))
  next.selected = Math.min(next.unlocked - 1, Math.max(0, Math.floor(Number(save.selected) || 0)))
  for (const key of Object.keys(next.upgrades)) {
    const level = Math.floor(Number(save.upgrades?.[key]) || 0)
    next.upgrades[key] = Math.min(5, Math.max(0, level))
  }
  const owned = Array.isArray(save.owned) ? save.owned.filter((id) => theme.orbStyles.some((style) => style.id === id)) : ['glass']
  if (!owned.includes('glass')) owned.unshift('glass')
  next.owned = owned
  next.style = owned.includes(save.style) ? save.style : 'glass'
  next.muted = Boolean(save.muted)
  next.best = {}
  if (save.best && typeof save.best === 'object') {
    for (const [key, value] of Object.entries(save.best)) {
      const orbs = Math.floor(Number(value) || 0)
      if (orbs > 0) next.best[key] = orbs
    }
  }
  return next
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return blank()
    return clamp(JSON.parse(raw))
  } catch {
    return blank()
  }
}

export function writeSave(save) {
  const safe = clamp(save)
  localStorage.setItem(KEY, JSON.stringify(safe))
  return safe
}
