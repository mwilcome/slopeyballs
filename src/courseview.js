import * as THREE from 'three'
import { COIN_RADIUS, FLOCK_COUNT, RADIUS } from './content/balance.js'
import { theme } from './theme/theme.js'

const HALF_WIDTH = 1.7

function ribbonGeometry(samples) {
  const positions = []
  const colors = []
  const indices = []
  for (let i = 0; i < samples.length; i++) {
    const shade = Math.floor(samples[i].x / 2) % 2 === 0 ? 1 : 0.78
    positions.push(samples[i].x, samples[i].y, -HALF_WIDTH, samples[i].x, samples[i].y, HALF_WIDTH)
    colors.push(shade, shade, shade, shade, shade, shade)
  }
  for (let i = 0; i < samples.length - 1; i++) {
    const a = i * 2
    const b = a + 1
    const c = a + 2
    const d = a + 3
    indices.push(a, c, b, b, c, d)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function labelSprite(text, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const draw = canvas.getContext('2d')
  draw.clearRect(0, 0, canvas.width, canvas.height)
  draw.font = '700 80px Segoe UI, sans-serif'
  draw.textAlign = 'center'
  draw.textBaseline = 'middle'
  draw.fillStyle = color
  draw.fillText(text, 128, 68)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(2.2, 1.1, 1)
  sprite.userData.disposeMaterial = true
  return sprite
}

function gateText(gate) {
  if (gate.kind === 'add') return `+${gate.amount}`
  if (gate.kind === 'multiply') return `×${gate.amount}`
  return `−${gate.amount}`
}

function disposeTree(object) {
  object.traverse((node) => {
    if (node.userData.disposeGeometry && node.geometry) node.geometry.dispose()
    if (node.userData.disposeMaterial && node.material) {
      if (node.material.map) node.material.map.dispose()
      node.material.dispose()
    }
  })
}

export function createCourseView(scene) {
  const courseGroup = new THREE.Group()
  const decorGroup = new THREE.Group()
  scene.add(decorGroup)
  scene.add(courseGroup)

  const unitBox = new THREE.BoxGeometry(1, 1, 1)
  const sphere = new THREE.SphereGeometry(1, 22, 16)
  const coinGeo = new THREE.SphereGeometry(COIN_RADIUS, 12, 10)

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.88,
    metalness: 0.04,
    side: THREE.DoubleSide,
    vertexColors: true,
  })
  const lipMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
  })
  const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0.05 })
  const mesaMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 })
  const mesaNearMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 })
  const coinMat = new THREE.MeshStandardMaterial({
    color: theme.coin.color,
    emissive: theme.coin.emissive,
    emissiveIntensity: 0.45,
    roughness: 0.35,
    metalness: 0.2,
  })
  const orbMat = new THREE.MeshStandardMaterial({
    color: theme.orbStyles[0].color,
    emissive: theme.orbStyles[0].emissive,
    emissiveIntensity: 0.35,
    roughness: theme.orbStyles[0].roughness,
    metalness: theme.orbStyles[0].metalness,
  })

  const volumeMats = {}
  for (const kind of ['add', 'multiply', 'subtract']) {
    volumeMats[kind] = new THREE.MeshStandardMaterial({
      color: theme.gates[kind],
      emissive: theme.gates[kind],
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.16,
      roughness: 0.35,
      metalness: 0,
      depthWrite: false,
    })
  }

  const lead = new THREE.Mesh(sphere, orbMat)
  lead.scale.setScalar(RADIUS)
  scene.add(lead)

  const flock = []
  for (let i = 0; i < FLOCK_COUNT; i++) {
    const mesh = new THREE.Mesh(sphere, orbMat)
    mesh.scale.setScalar(RADIUS * 0.72)
    mesh.visible = false
    scene.add(mesh)
    flock.push(mesh)
  }

  const skyGeo = new THREE.SphereGeometry(380, 28, 16)
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    fog: false,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(theme.biomes[0].skyTop) },
      bottomColor: { value: new THREE.Color(theme.biomes[0].skyBottom) },
    },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPos;
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      void main() {
        float h = normalize(vPos).y * 0.5 + 0.5;
        gl_FragColor = vec4(mix(bottomColor, topColor, smoothstep(0.0, 1.0, h)), 1.0);
      }
    `,
  })
  const sky = new THREE.Mesh(skyGeo, skyMat)
  sky.frustumCulled = false
  sky.renderOrder = -1

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.05)
  const sun = new THREE.DirectionalLight(0xffffff, 1.25)
  sun.position.set(-30, 48, 24)
  scene.add(hemi, sun)

  const coinMeshes = []
  let mapToken = 0

  function applyBiomeColors(biome) {
    ribbonMat.color.setHex(biome.ribbon)
    lipMat.color.setHex(biome.lip)
    postMat.color.setHex(biome.post)
    mesaMat.color.setHex(biome.mesa)
    mesaNearMat.color.setHex(biome.mesaNear)
    hemi.color.setHex(biome.hemiSky)
    hemi.groundColor.setHex(biome.hemiGround)
    sun.color.setHex(biome.sun)
    skyMat.uniforms.topColor.value.setHex(biome.skyTop)
    skyMat.uniforms.bottomColor.value.setHex(biome.skyBottom)
    scene.fog = new THREE.FogExp2(biome.fog, biome.fogDensity)
    scene.background = new THREE.Color(biome.skyBottom)
  }

  async function applyMaps(biome) {
    const token = ++mapToken
    ribbonMat.map = null
    ribbonMat.needsUpdate = true
    sky.visible = true
    if (biome.ribbonMap) {
      const texture = await loadMap(biome.ribbonMap)
      if (token !== mapToken) return
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        ribbonMat.map = texture
        ribbonMat.needsUpdate = true
      }
    }
    if (biome.skyMap) {
      const texture = await loadMap(biome.skyMap)
      if (token !== mapToken) return
      if (texture) {
        scene.background = texture
        sky.visible = false
      }
    }
  }

  function applyStyle(style) {
    orbMat.color.setHex(style.color)
    orbMat.emissive.setHex(style.emissive)
    orbMat.roughness = style.roughness
    orbMat.metalness = style.metalness
    orbMat.map = null
    orbMat.needsUpdate = true
    if (style.map) {
      loadMap(style.map).then((texture) => {
        if (!texture || orbMat.color.getHex() !== style.color) return
        orbMat.map = texture
        orbMat.needsUpdate = true
      })
    }
  }

  function rebuild(course, biome) {
    for (const child of [...courseGroup.children]) {
      disposeTree(child)
      courseGroup.remove(child)
    }
    for (const child of [...decorGroup.children]) {
      disposeTree(child)
      decorGroup.remove(child)
    }
    coinMeshes.length = 0
    applyBiomeColors(biome)
    applyMaps(biome)

    const segments = []
    let current = []
    for (let x = 0; x <= course.length; x += 0.45) {
      const y = course.height(x)
      if (y == null) {
        if (current.length > 1) segments.push(current)
        current = []
        continue
      }
      current.push({ x, y })
    }
    if (current.length > 1) segments.push(current)

    for (const samples of segments) {
      const mesh = new THREE.Mesh(ribbonGeometry(samples), ribbonMat)
      mesh.userData.disposeGeometry = true
      courseGroup.add(mesh)
      const lipSamples = samples.map((sample) => ({ x: sample.x, y: sample.y - 0.16 }))
      const lip = new THREE.Mesh(ribbonGeometry(lipSamples), lipMat)
      lip.userData.disposeGeometry = true
      courseGroup.add(lip)
    }

    for (let i = 0; i < 9; i++) {
      const width = 7 + ((i * 5) % 9)
      const height = 5 + ((i * 7) % 11)
      const mesh = new THREE.Mesh(unitBox, i % 2 === 0 ? mesaMat : mesaNearMat)
      mesh.scale.set(width, height, 3.2)
      mesh.position.set(i * 16 - 8, height / 2 - 7, -24 - (i % 3) * 4)
      decorGroup.add(mesh)
    }

    for (const gate of course.gates) {
      const color = theme.gates[gate.kind]
      const height = Math.max(0.4, gate.y1 - gate.y0)
      const slab = new THREE.Mesh(unitBox, volumeMats[gate.kind])
      slab.scale.set(0.42, height, 2.45)
      slab.position.set(gate.x, (gate.y0 + gate.y1) / 2, 0)
      courseGroup.add(slab)

      const top = new THREE.Mesh(unitBox, postMat)
      top.scale.set(0.18, 0.14, 2.7)
      top.position.set(gate.x, gate.y1, 0)
      courseGroup.add(top)

      const bottom = new THREE.Mesh(unitBox, postMat)
      bottom.scale.set(0.18, 0.14, 2.7)
      bottom.position.set(gate.x, gate.y0, 0)
      courseGroup.add(bottom)

      const support = Math.max(0.2, gate.y1 - Math.min(gate.h, gate.y0))
      for (const z of [-1.25, 1.25]) {
        const post = new THREE.Mesh(unitBox, postMat)
        post.scale.set(0.16, support, 0.16)
        post.position.set(gate.x, Math.min(gate.h, gate.y0) + support / 2, z)
        courseGroup.add(post)
      }

      const sprite = labelSprite(gateText(gate), cssHex(color))
      sprite.position.set(gate.x, (gate.y0 + gate.y1) / 2, 1.8)
      courseGroup.add(sprite)
    }

    const arch = new THREE.Mesh(unitBox, postMat)
    arch.scale.set(0.22, 0.18, 3.1)
    arch.position.set(course.finishX, course.height(course.finishX) + 2.4, 0)
    courseGroup.add(arch)

    for (const coin of course.coins) {
      const mesh = new THREE.Mesh(coinGeo, coinMat)
      mesh.position.set(coin.x, coin.y, 0)
      mesh.userData.coin = coin
      courseGroup.add(mesh)
      coinMeshes.push(mesh)
    }
  }

  function flockSlot(index) {
    const row = index % 4
    const layer = Math.floor(index / 4)
    return {
      x: -0.72 - layer * 0.46,
      z: (row - 1.5) * 0.34,
      y: ((index % 3) - 1) * 0.06,
    }
  }

  function syncOrbs(sim, course, dt) {
    lead.visible = sim.orbs > 0
    lead.position.set(sim.x, sim.y, 0)
    const extras = Math.min(Math.max(sim.orbs - 1, 0), flock.length)
    const blend = 1 - Math.exp(-10 * dt)
    for (let i = 0; i < flock.length; i++) {
      const mesh = flock[i]
      mesh.visible = i < extras
      if (!mesh.visible) continue
      const slot = flockSlot(i)
      const targetX = sim.x + slot.x
      let targetY = sim.y + slot.y
      if (sim.grounded) {
        const ground = course.height(targetX)
        if (ground != null) targetY = ground + RADIUS * 0.85
      }
      mesh.position.x += (targetX - mesh.position.x) * blend
      mesh.position.y += (targetY - mesh.position.y) * blend
      mesh.position.z += (slot.z - mesh.position.z) * blend
    }
  }

  function snapOrbs(sim) {
    lead.position.set(sim.x, sim.y, 0)
    for (let i = 0; i < flock.length; i++) {
      const slot = flockSlot(i)
      flock[i].position.set(sim.x + slot.x, sim.y, slot.z)
    }
  }

  function spinCoins(dt) {
    for (const mesh of coinMeshes) {
      mesh.visible = !mesh.userData.coin.got
      if (mesh.visible) mesh.rotation.y += dt * 2.2
    }
  }

  return {
    sky,
    rebuild,
    applyStyle,
    syncOrbs,
    snapOrbs,
    spinCoins,
    lead,
  }
}

function cssHex(hex) {
  return `#${hex.toString(16).padStart(6, '0')}`
}

function loadMap(url) {
  return new THREE.TextureLoader().loadAsync(url).then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }).catch(() => {
    console.warn('Slopeyballs: missing theme image', url)
    return null
  })
}
