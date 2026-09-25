import { balance } from './content/balance.js'
import { copy } from './content/copy.js'
import { COURSE_COUNT, courseMeta } from './content/courses.js'
import { cssColor, theme } from './theme/theme.js'

export function createUI(api) {
  const root = document.getElementById('ui')
  root.innerHTML = `
    <div id="hud" class="hidden">
      <div class="hud-top">
        <button type="button" data-ui data-action="abandon">${copy.home}</button>
        <div>
          <div id="hud-course"></div>
          <div id="hud-grip"></div>
        </div>
        <div class="hud-stats">
          <div><span id="hud-orbs">0</span> ${copy.orbs}</div>
          <div><span id="hud-coins">0</span> ${copy.coins}</div>
        </div>
      </div>
      <div id="hud-hint"></div>
    </div>
    <section id="home" class="panel" data-ui></section>
    <section id="shop" class="panel hidden" data-ui></section>
    <section id="result" class="panel hidden" data-ui></section>
  `

  const hud = document.getElementById('hud')
  const home = document.getElementById('home')
  const shop = document.getElementById('shop')
  const result = document.getElementById('result')
  const hudCourse = document.getElementById('hud-course')
  const hudGrip = document.getElementById('hud-grip')
  const hudOrbs = document.getElementById('hud-orbs')
  const hudCoins = document.getElementById('hud-coins')
  const hudHint = document.getElementById('hud-hint')

  function paint() {
    const save = api.getSave()
    const screen = api.getScreen()
    const selected = courseMeta(save.selected)
    const best = save.best[String(save.selected)]

    document.documentElement.style.setProperty('--ink', api.uiInk())
    document.documentElement.style.setProperty('--panel', api.uiPanel())
    document.documentElement.style.setProperty('--accent', api.uiAccent())
    document.documentElement.style.setProperty('--good', cssColor(theme.gates.add))
    document.documentElement.style.setProperty('--gold', cssColor(theme.gates.multiply))
    document.documentElement.style.setProperty('--bad', cssColor(theme.gates.subtract))

    hud.classList.toggle('hidden', screen !== 'play')
    home.classList.toggle('hidden', screen !== 'home')
    shop.classList.toggle('hidden', screen !== 'shop')
    result.classList.toggle('hidden', screen !== 'result')

    if (screen === 'home') {
      home.innerHTML = `
        <h1>${copy.title}</h1>
        <p class="blurb">${copy.blurb}</p>
        <div class="course-row">
          <button type="button" data-ui data-action="prev" ${save.selected <= 0 ? 'disabled' : ''}>◀</button>
          <div>
            <strong>${selected.name}</strong>
            <div class="meta">${copy.open} ${save.unlocked} / ${COURSE_COUNT}</div>
          </div>
          <button type="button" data-ui data-action="next-course" ${save.selected >= save.unlocked - 1 ? 'disabled' : ''}>▶</button>
        </div>
        <p class="meta">${best ? `${copy.best}: ${best} ${copy.orbs}` : copy.noneYet}</p>
        <div class="tips">
          ${copy.tips.map((tip) => `<div>${tip}</div>`).join('')}
          <div>
            <span class="swatch" style="background:${cssColor(theme.gates.add)}"></span>
            <span class="swatch" style="background:${cssColor(theme.gates.multiply)}"></span>
            <span class="swatch" style="background:${cssColor(theme.gates.subtract)}"></span>
            ${copy.gates}
          </div>
        </div>
        <div class="row">
          <button type="button" class="primary" data-ui data-action="start">${copy.play}</button>
          <button type="button" data-ui data-action="shop">${copy.workshop}</button>
          <button type="button" data-ui data-action="mute">${save.muted ? copy.soundOff : copy.soundOn}</button>
        </div>
      `
    }

    if (screen === 'shop') {
      const upgradeRows = Object.entries(balance.upgrades).map(([key, spec]) => {
        const level = save.upgrades[key]
        const maxed = level >= spec.max
        const cost = spec.cost(level)
        const text = copy.upgrades[key]
        return `
          <div class="item">
            <div>
              <strong>${text.name} ${level}/${spec.max}</strong>
              <p>${text.detail}</p>
            </div>
            <button type="button" data-ui data-action="buy-upgrade" data-id="${key}" ${maxed || save.coins < cost ? 'disabled' : ''}>
              ${maxed ? copy.maxed : `${copy.buy} ${cost}`}
            </button>
          </div>
        `
      }).join('')

      const styleRows = theme.orbStyles.map((style) => {
        const owned = save.owned.includes(style.id)
        const using = save.style === style.id
        let label = `${copy.buy} ${style.cost}`
        let disabled = save.coins < style.cost
        let action = 'buy-style'
        if (using) {
          label = copy.using
          disabled = true
          action = 'use-style'
        } else if (owned) {
          label = copy.use
          disabled = false
          action = 'use-style'
        }
        return `
          <div class="item">
            <div>
              <strong><span class="swatch" style="background:${cssColor(style.color)}"></span>${style.name}</strong>
            </div>
            <button type="button" data-ui data-action="${action}" data-id="${style.id}" ${disabled ? 'disabled' : ''}>${label}</button>
          </div>
        `
      }).join('')

      shop.innerHTML = `
        <h1>${copy.workshop}</h1>
        <p class="meta">${save.coins} ${copy.coins}</p>
        <div class="shop-block">
          <h2>${copy.workshop}</h2>
          ${upgradeRows}
        </div>
        <div class="shop-block">
          <h2>${copy.looks}</h2>
          ${styleRows}
        </div>
        <div class="row">
          <button type="button" data-ui data-action="home">${copy.back}</button>
        </div>
      `
    }

    if (screen === 'result') {
      const report = api.getReport()
      result.innerHTML = `
        <h2>${report.cleared ? copy.cleared : copy.failed}</h2>
        <p>${report.orbs} ${copy.orbs}</p>
        <p>${copy.banked}: ${report.banked}</p>
        ${report.newBest ? `<p>${copy.newBest}</p>` : ''}
        ${report.cleared && report.last ? `<p>${copy.last}</p>` : ''}
        <div class="row">
          <button type="button" class="primary" data-ui data-action="retry">${copy.retry}</button>
          ${report.cleared && !report.last ? `<button type="button" data-ui data-action="next">${copy.next}</button>` : ''}
          <button type="button" data-ui data-action="home">${copy.home}</button>
        </div>
      `
    }
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]')
    if (!button || button.disabled) return
    button.blur()
    const action = button.dataset.action
    const id = button.dataset.id
    if (action === 'start' || action === 'retry') api.start()
    else if (action === 'shop') api.show('shop')
    else if (action === 'home' || action === 'abandon') api.home()
    else if (action === 'prev') api.shiftCourse(-1)
    else if (action === 'next-course') api.shiftCourse(1)
    else if (action === 'next') api.nextCourse()
    else if (action === 'mute') api.toggleMute()
    else if (action === 'buy-upgrade') api.buyUpgrade(id)
    else if (action === 'buy-style') api.buyStyle(id)
    else if (action === 'use-style') api.useStyle(id)
  })

  return {
    paint,
    setHud({ course, orbs, coins, grip, hint }) {
      hudCourse.textContent = course
      hudOrbs.textContent = String(orbs)
      hudCoins.textContent = String(coins)
      hudGrip.textContent = grip
      hudHint.textContent = hint
    },
  }
}

export function popup(camera, text, position, color) {
  const layer = document.getElementById('popups')
  const element = document.createElement('div')
  element.className = 'popup'
  element.textContent = text
  element.style.color = color
  layer.appendChild(element)
  const started = performance.now()
  const origin = position.clone()

  function tick(now) {
    const t = (now - started) / 700
    if (t >= 1) {
      element.remove()
      return
    }
    origin.y += 0
    const point = origin.clone()
    point.y += t * 1.4
    point.project(camera)
    const x = (point.x * 0.5 + 0.5) * window.innerWidth
    const y = (-point.y * 0.5 + 0.5) * window.innerHeight
    element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    element.style.opacity = String(1 - t)
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
