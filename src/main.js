import * as THREE from 'three'
import { createGame } from './game.js'

const canvas = document.getElementById('view')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.setClearColor(0x121018, 1)

canvas.addEventListener('contextmenu', (event) => event.preventDefault())

const game = createGame(renderer)
let frameId = 0

function loop(now) {
  frameId = requestAnimationFrame(loop)
  game.frame(now)
}

frameId = requestAnimationFrame(loop)

if (import.meta.hot) {
  import.meta.hot.dispose(() => cancelAnimationFrame(frameId))
}
