// Usage: download countries.geo.json (johan/world.geo.json) next to this file as world.geo.json,
// run `node scripts/gen-globe-dots.mjs`, then paste globe-path.txt into src/components/globe-dots.ts.
// Generate a dotted orthographic globe (goldsand-style) as a compact SVG path.
import { readFileSync } from 'node:fs'
const geo = JSON.parse(readFileSync(new URL('./world.geo.json', import.meta.url), 'utf8'))

// collect all polygon rings as [lon,lat] arrays
const rings = []
for (const f of geo.features) {
  const g = f.geometry
  if (!g) continue
  if (g.type === 'Polygon') for (const r of g.coordinates) rings.push(r)
  else if (g.type === 'MultiPolygon') for (const p of g.coordinates) for (const r of p) rings.push(r)
}
// precompute bounding boxes per ring for speed
const boxes = rings.map((r) => {
  let x0 = 180, x1 = -180, y0 = 90, y1 = -90
  for (const [x, y] of r) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  return [x0, y0, x1, y1]
})
const inRing = (lon, lat, ring) => {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
const isLand = (lon, lat) => {
  let hits = 0
  for (let k = 0; k < rings.length; k++) {
    const [x0, y0, x1, y1] = boxes[k]
    if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue
    if (inRing(lon, lat, rings[k])) hits++
  }
  return hits % 2 === 1 // even-odd: holes (lakes) excluded
}

// ── projection params (tuned for a bottom-cropped dome) ──
const D2R = Math.PI / 180
const R = 210            // sphere radius (svg units)
const CX = 170, CY = 330 // sphere center; canvas viewBox is 340x300 → dome top at y=120
const LAT0 = 28 * D2R    // viewer-facing latitude
const LON0 = -42 * D2R   // viewer-facing longitude (mid-Atlantic: Americas left, Europe/Africa right)
const project = (lonDeg, latDeg) => {
  const lon = lonDeg * D2R, lat = latDeg * D2R
  const cosc = Math.sin(LAT0) * Math.sin(lat) + Math.cos(LAT0) * Math.cos(lat) * Math.cos(lon - LON0)
  if (cosc <= 0.04) return null // back hemisphere
  const x = R * Math.cos(lat) * Math.sin(lon - LON0)
  const y = R * (Math.cos(LAT0) * Math.sin(lat) - Math.sin(LAT0) * Math.cos(lat) * Math.cos(lon - LON0))
  return { x: CX + x, y: CY - y, cosc }
}

// sample grid: even surface density (lon step widens toward poles)
const STEP = 2.45
let d = ''
let n = 0
for (let lat = -56; lat <= 84; lat += STEP) {
  const lonStep = STEP / Math.max(0.25, Math.cos(lat * D2R))
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (!isLand(lon, lat)) continue
    const p = project(lon, lat)
    if (!p || p.y > 305 || p.y < 112) continue
    d += `M${p.x.toFixed(1)} ${p.y.toFixed(1)}h0`
    n++
  }
}
console.log('dots:', n, 'bytes:', d.length)
// landmarks for pings / arc endpoints
for (const [name, lon, lat] of [['NY', -74, 40.7], ['Lisboa', -9.1, 38.7], ['SaoPaulo', -46.6, -23.5], ['London', -0.1, 51.5], ['Miami', -80.2, 25.8]]) {
  const p = project(lon, lat)
  console.log(name, p ? `${p.x.toFixed(1)},${p.y.toFixed(1)} cosc=${p.cosc.toFixed(2)}` : 'hidden')
}
import { writeFileSync } from 'node:fs'
writeFileSync(new URL('./globe-path.txt', import.meta.url), d)
