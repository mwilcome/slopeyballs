import * as THREE from 'three'
import { createAudio } from './audio.js'
import { balance, CAMERA, tuningFrom } from './content/balance.js'
import { copy } from './content/copy.js'
import { COURSE_COUNT, buildCourse, courseMeta } from './content/courses.js'
import { createCourseView } from './courseview.js'
import { loadSave, writeSave } from './save.js'
import { createSim, stepSim } from './sim.js'
import { biomeById, cssColor, styleById, theme } from './theme/theme.js'
import { createUI, popup } from './ui.js'

const STEP = 1 / 120

export function createGame(renderer) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 800)
  scene.add(camera)

  const audio = createAudio()
  const view = createCourseView(scene)
  scene.add(view.sky)

  let save = loadSave()
  audio.setMuted(save.muted)

  let screen = 'home'
  let course = null
  let sim = null
  let tuning = tuningFrom(save.upgrades)
  let ended = false
  let report = null
  let hint = copy.tips[1]
  let pointerHold = false
  let keyHold = false
  const look = new THREE.Vector3()
  const camDesired = new THREE.Vector3()
  let accumulator = 0
  let last = 0
  let menuTime = 0

  const ui = createUI({
    getSave: () => save,
    getScreen: () => screen,
    getReport: () => report,
    uiInk: () => biomeById(courseMeta(save.selected).biome).uiInk,
    uiPanel: () => biomeById(courseMeta(save.selected).biome).uiPanel,
    uiAccent: () => biomeById(courseMeta(save.selected).biome).uiAccent,
    show(next) {
      screen = next
      ui.paint()
    },
    home() {
      screen = 'home'
      park()
      ui.paint()
    },
    start() { startRun() },
    shiftCourse(dir) { shift(dir) },
    nextCourse() {
      if (save.selected < save.unlocked - 1) save.selected += 1
      save = writeSave(save)
      startRun()
    },
    toggleMute() {
      save.muted = !save.muted
      audio.setMuted(save.muted)
      save = writeSave(save)
      ui.paint()
    },
    buyUpgrade(id) { buyUpgrade(id) },
    buyStyle(id) { buyStyle(id) },
    useStyle(id) { useStyle(id) },
  })

  function biomeOf(index) {
    return biomeById(courseMeta(index).biome)
  }

  function loadCourse(index) {
    course = buildCourse(index)
    view.rebuild(course, biomeOf(index))
    view.applyStyle(styleById(save.style))
    tuning = tuningFrom(save.upgrades)
    sim = createSim(course, tuning)
    view.snapOrbs(sim)
    ended = false
  }

  function park() {
    loadCourse(save.selected)
    hint = copy.tips[1]
    pointerHold = false
    keyHold = false
  }

  function startRun() {
    audio.unlock()
    loadCourse(save.selected)
    screen = 'play'
    hint = copy.tips[1]
    pointerHold = false
    keyHold = false
    ui.paint()
  }

  function shift(dir) {
    const next = save.selected + dir
    if (next < 0 || next > save.unlocked - 1) return
    save.selected = next
    save = writeSave(save)
    park()
    ui.paint()
  }

  function buyUpgrade(id) {
    const spec = balance.upgrades[id]
    if (!spec) return
    const level = save.upgrades[id]
    if (level >= spec.max) return
    const cost = spec.cost(level)
    if (save.coins < cost) return
    save.coins -= cost
    save.upgrades[id] += 1
    save = writeSave(save)
    ui.paint()
  }

  function buyStyle(id) {
    const style = styleById(id)
    if (save.owned.includes(id) || save.coins < style.cost) return
    save.coins -= style.cost
    save.owned = [...save.owned, id]
    save.style = id
    save = writeSave(save)
    view.applyStyle(style)
    ui.paint()
  }

  function useStyle(id) {
    if (!save.owned.includes(id)) return
    save.style = id
    save = writeSave(save)
    view.applyStyle(styleById(id))
    ui.paint()
  }

  function endRun(cleared) {
    if (ended) return
    ended = true
    const banked = Math.floor((sim.coins + (cleared ? sim.orbs * tuning.clearBonusPerOrb : 0)) * tuning.purse)
    save.coins += banked
    let newBest = false
    if (cleared) {
      const key = String(course.index)
      if (sim.orbs > (save.best[key] || 0)) {
        save.best[key] = sim.orbs
        newBest = true
      }
      if (course.index === save.unlocked - 1 && save.unlocked < COURSE_COUNT) save.unlocked += 1
    }
    save = writeSave(save)
    report = {
      cleared,
      orbs: sim.orbs,
      banked,
      newBest,
      last: course.index >= COURSE_COUNT - 1,
    }
    screen = 'result'
    if (cleared) audio.win()
    else audio.fail()
    ui.paint()
  }

  function playStep(dt) {
    if (ended) return
    sim.hold = pointerHold || keyHold
    const events = stepSim(sim, course, tuning, dt)
    for (const event of events) {
      if (event.type === 'launch') {
        audio.launch()
        hint = ''
      } else if (event.type === 'gate') {
        const gate = event.gate
        const text = gate.kind === 'add' ? `+${gate.amount}` : gate.kind === 'multiply' ? `×${gate.amount}` : `−${gate.amount}`
        popup(camera, text, new THREE.Vector3(gate.x, (gate.y0 + gate.y1) / 2, 0), cssColor(theme.gates[gate.kind]))
        if (gate.kind === 'subtract') audio.bad()
        else audio.good()
      } else if (event.type === 'coin') {
        audio.coin()
      } else if (event.type === 'finish') {
        endRun(true)
      } else if (event.type === 'die') {
        endRun(false)
      }
    }
  }

  function placePlayCamera(dt) {
    camDesired.set(sim.x - CAMERA.back, sim.y + CAMERA.up, CAMERA.side)
    camera.position.lerp(camDesired, 1 - Math.exp(-4.5 * dt))
    look.set(sim.x + CAMERA.lookAhead, sim.y + CAMERA.lookUp, 0)
    camera.lookAt(look)
    const fov = 52 + Math.min(sim.speed, 20) * 0.28
    if (Math.abs(camera.fov - fov) > 0.04) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  }

  function placeMenuCamera(dt) {
    menuTime += dt
    const x = 14 + Math.sin(menuTime * 0.22) * 2.5
    camera.position.set(x, 5.4, CAMERA.side)
    camera.lookAt(x + 16, 1.1, 0)
    if (camera.fov !== 52) {
      camera.fov = 52
      camera.updateProjectionMatrix()
    }
  }

  function present(dt) {
    view.syncOrbs(sim, course, Math.max(dt, 0.001))
    view.spinCoins(dt)
    if (screen === 'play') {
      placePlayCamera(dt)
      ui.setHud({
        course: course.name,
        orbs: sim.orbs,
        coins: sim.coins,
        grip: (pointerHold || keyHold) ? copy.grip : copy.air,
        hint,
      })
    } else {
      placeMenuCamera(dt)
    }
    view.sky.position.copy(camera.position)
  }

  function resize() {
    const width = window.innerWidth
    const height = Math.max(1, window.innerHeight)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
  }

  window.addEventListener('resize', resize)
  window.addEventListener('pointerdown', (event) => {
    audio.unlock()
    if (event.button !== 0) return
    if (event.target.closest('[data-ui]')) return
    pointerHold = true
  })
  window.addEventListener('pointerup', () => { pointerHold = false })
  window.addEventListener('pointercancel', () => { pointerHold = false })
  window.addEventListener('blur', () => { pointerHold = false; keyHold = false })
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      if (screen === 'play') {
        event.preventDefault()
        if (!event.repeat) keyHold = true
      }
    } else if (event.code === 'Escape') {
      screen = 'home'
      park()
      ui.paint()
    } else if (event.code === 'KeyM') {
      save.muted = !save.muted
      audio.setMuted(save.muted)
      save = writeSave(save)
      ui.paint()
    } else if (event.code === 'KeyR' && (screen === 'play' || screen === 'result')) {
      startRun()
    }
  })
  window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') keyHold = false
  })

  resize()
  park()
  ui.paint()

  return {
    frame(now) {
      if (!last) {
        last = now
        present(0.016)
        renderer.render(scene, camera)
        return
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (screen === 'play') {
        accumulator += dt
        let steps = 0
        while (accumulator >= STEP && steps < 8) {
          accumulator -= STEP
          steps += 1
          playStep(STEP)
        }
      } else {
        accumulator = 0
      }
      present(dt)
      renderer.render(scene, camera)
    },
  }
}
