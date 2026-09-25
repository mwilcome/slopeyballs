// Visual swap point. Change colors here, or drop images in public/theme and
// set a path such as skyMap: '/theme/sky.jpg' or ribbonMap: '/theme/ribbon.jpg'.
// Wording is in src/content/copy.js. Courses are in src/content/courses.js.
// Nothing here is loaded from a server. Paths are files shipped with the page.

export const theme = {
  gates: {
    add: 0x9be7c4,
    multiply: 0xf0d078,
    subtract: 0xf09988,
  },
  coin: {
    color: 0xf2d38a,
    emissive: 0x8a6420,
  },
  orbStyles: [
    { id: 'glass', name: 'Glass', cost: 0, color: 0xd7fff4, emissive: 0x1a6a62, roughness: 0.15, metalness: 0.08, map: null },
    { id: 'ember', name: 'Ember', cost: 60, color: 0xffb088, emissive: 0xa8431c, roughness: 0.42, metalness: 0.05, map: null },
    { id: 'tide', name: 'Tide', cost: 60, color: 0x8fd0ff, emissive: 0x1d4e8a, roughness: 0.2, metalness: 0.12, map: null },
    { id: 'ink', name: 'Ink', cost: 90, color: 0x9aa3bd, emissive: 0x2a3148, roughness: 0.4, metalness: 0.32, map: null },
  ],
  biomes: [
    {
      id: 'dusk-mesa',
      skyTop: 0x1c2340,
      skyBottom: 0xd4896a,
      fog: 0xc4847a,
      fogDensity: 0.016,
      ribbon: 0xc9845a,
      lip: 0x8d5438,
      post: 0xefe6d6,
      mesa: 0x6e4a55,
      mesaNear: 0x8d5d58,
      hemiSky: 0xffd0b0,
      hemiGround: 0x6a4038,
      sun: 0xfff1df,
      uiInk: '#f6efe6',
      uiPanel: 'rgba(28, 22, 34, 0.78)',
      uiAccent: '#f0c27a',
      skyMap: null,
      ribbonMap: null,
    },
    {
      id: 'tide-shelf',
      skyTop: 0x12343c,
      skyBottom: 0x8fd0c8,
      fog: 0x7eb8b4,
      fogDensity: 0.018,
      ribbon: 0x2f6f73,
      lip: 0x1b4448,
      post: 0xe7fff8,
      mesa: 0x1d4e55,
      mesaNear: 0x2c6a66,
      hemiSky: 0xd5fff6,
      hemiGround: 0x14343a,
      sun: 0xe9fff8,
      uiInk: '#e7fff8',
      uiPanel: 'rgba(10, 28, 32, 0.78)',
      uiAccent: '#f2d38a',
      skyMap: null,
      ribbonMap: null,
    },
    {
      id: 'ash-garden',
      skyTop: 0x2a2422,
      skyBottom: 0xc47a58,
      fog: 0xb08578,
      fogDensity: 0.02,
      ribbon: 0x4a403c,
      lip: 0x2a2422,
      post: 0xf0e6dc,
      mesa: 0x3a3330,
      mesaNear: 0x5c4a44,
      hemiSky: 0xffd8c8,
      hemiGround: 0x2a211e,
      sun: 0xffe6d4,
      uiInk: '#f6efe8',
      uiPanel: 'rgba(24, 18, 16, 0.8)',
      uiAccent: '#e7a05a',
      skyMap: null,
      ribbonMap: null,
    },
    {
      id: 'night-orchard',
      skyTop: 0x101426,
      skyBottom: 0x3d4d78,
      fog: 0x3a4668,
      fogDensity: 0.02,
      ribbon: 0x3e6b4f,
      lip: 0x234233,
      post: 0xe7f0dc,
      mesa: 0x243044,
      mesaNear: 0x2f4a40,
      hemiSky: 0xc9d6ff,
      hemiGround: 0x1a241c,
      sun: 0xf0f4ff,
      uiInk: '#eef2e6',
      uiPanel: 'rgba(12, 16, 28, 0.8)',
      uiAccent: '#d6e28a',
      skyMap: null,
      ribbonMap: null,
    },
  ],
}

export function cssColor(hex) {
  return `#${hex.toString(16).padStart(6, '0')}`
}

export function biomeById(id) {
  return theme.biomes.find((biome) => biome.id === id) || theme.biomes[0]
}

export function styleById(id) {
  return theme.orbStyles.find((style) => style.id === id) || theme.orbStyles[0]
}
