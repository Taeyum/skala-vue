<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { VIEW_W, VIEW_H, ARROW_CELLS } from '@/utils/koreaMap.js'
import { sampleGrid, speedOf } from '@/utils/windField.js'
import { WIND_LEVELS } from '@/utils/weatherTheme.js'

const props = defineProps({
  // buildWindGrid가 만든 격자. 입자는 여기서 값을 읽는다
  grid: { type: Object, default: null },
})

const canvas = ref(null)
let ctx = null
let rafId = null
let observer = null
let particles = []
let frame = 0

// 실제 축척으로 움직이면 5m/s 바람이 지도를 가로지르는 데 30시간이 걸린다.
// 흐름이 보이도록 과장한 값
const SPEED_SCALE = 0.9
const MIN_AGE = 90
const MAX_EXTRA_AGE = 60
// 알파를 깎는 방식이라 8비트 반올림 때문에 잔상이 완전히 사라지지 않는다.
// 주기적으로 완전히 지운다
const CLEAR_EVERY = 200

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 육지 안에서만 태어나게 한다. 화살표가 쓰는 격자를 그대로 재사용
const spawn = (p) => {
  const cell = ARROW_CELLS[Math.floor(Math.random() * ARROW_CELLS.length)] ?? { x: 400, y: 400 }
  p.x = cell.x + (Math.random() - 0.5) * 48
  p.y = cell.y + (Math.random() - 0.5) * 48
  p.age = 0
  p.life = MIN_AGE + Math.random() * MAX_EXTRA_AGE
  return p
}

const buildParticles = (count) => {
  particles = Array.from({ length: count }, () => spawn({ x: 0, y: 0, age: 0, life: 0 }))
  // 처음부터 수명이 제각각이어야 한꺼번에 사라지지 않는다
  particles.forEach((p) => (p.age = Math.random() * p.life))
}

const resize = () => {
  const el = canvas.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (!rect.width) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.round(rect.width * dpr)
  el.height = Math.round(rect.height * dpr)
  ctx = el.getContext('2d')
  // 이후 모든 그리기를 viewBox 단위로 한다 — SVG 레이어와 같은 좌표를 쓰게 된다
  const s = (rect.width / VIEW_W) * dpr
  ctx.setTransform(s, 0, 0, s, 0, 0)
  ctx.lineCap = 'round'
}

// 한 걸음 전진. 수명이 다하거나 격자를 벗어나면 다시 태어난다
const step = (p) => {
  const { sx, sy } = sampleGrid(props.grid, p.x, p.y)
  const nx = p.x + sx * SPEED_SCALE
  const ny = p.y + sy * SPEED_SCALE
  const prev = { x: p.x, y: p.y }
  p.x = nx
  p.y = ny
  p.age += 1
  if (p.age > p.life || nx < 0 || nx > VIEW_W || ny < 0 || ny > VIEW_H) {
    spawn(p)
    return null
  }
  return { from: prev, to: { x: nx, y: ny }, speed: speedOf(sx, sy) }
}

const draw = () => {
  if (!ctx || !props.grid) return

  // 꼬리: 색을 덮는 게 아니라 알파를 깎는다.
  // 반투명 사각형을 덮으면 오버레이 캔버스라 아래 지도가 프레임마다 물든다
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
  ctx.fillRect(0, 0, VIEW_W, VIEW_H)
  ctx.globalCompositeOperation = 'source-over'

  if (++frame % CLEAR_EVERY === 0) ctx.clearRect(0, 0, VIEW_W, VIEW_H)

  // 세기별로 묶어서 그린다. 입자마다 stroke를 부르면 드로우 콜이 수백 번이 된다
  const buckets = WIND_LEVELS.map(() => [])
  for (const p of particles) {
    const seg = step(p)
    if (!seg) continue
    const i = WIND_LEVELS.findIndex((l) => seg.speed < l.max)
    buckets[i].push(seg)
  }

  ctx.lineWidth = 1.1
  buckets.forEach((segs, i) => {
    if (!segs.length) return
    ctx.strokeStyle = WIND_LEVELS[i].color
    ctx.beginPath()
    for (const s of segs) {
      ctx.moveTo(s.from.x, s.from.y)
      ctx.lineTo(s.to.x, s.to.y)
    }
    ctx.stroke()
  })
}

const loop = () => {
  draw()
  rafId = requestAnimationFrame(loop)
}

const stop = () => {
  cancelAnimationFrame(rafId)
  rafId = null
}

const start = () => {
  if (rafId || !props.grid) return
  if (reduced()) {
    drawStatic()
    return
  }
  rafId = requestAnimationFrame(loop)
}

// 모션을 줄이는 환경에서는 애니메이션 대신 흐름의 결만 한 번 그린다.
// 빈 화면보다 정보가 많고 움직임은 없다
const drawStatic = () => {
  if (!ctx || !props.grid) return
  ctx.clearRect(0, 0, VIEW_W, VIEW_H)
  ctx.lineWidth = 1.1
  for (const p of particles) {
    const segs = []
    for (let k = 0; k < 12; k++) {
      const seg = step(p)
      if (!seg) break
      segs.push(seg)
    }
    if (!segs.length) continue
    ctx.strokeStyle = WIND_LEVELS[WIND_LEVELS.findIndex((l) => segs[0].speed < l.max)].color
    ctx.beginPath()
    ctx.moveTo(segs[0].from.x, segs[0].from.y)
    for (const s of segs) ctx.lineTo(s.to.x, s.to.y)
    ctx.stroke()
  }
}

// 탭이 가려지면 브라우저가 rAF를 멈추므로 우리도 명시적으로 정리한다
const onVisibility = () => (document.hidden ? stop() : start())

onMounted(() => {
  resize()
  buildParticles(900)
  observer = new ResizeObserver(() => resize())
  observer.observe(canvas.value)
  document.addEventListener('visibilitychange', onVisibility)
  start()
})

onUnmounted(() => {
  stop()
  observer?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
})

// 격자가 처음 만들어지거나 시간여행으로 바뀌면 다시 시작
watch(
  () => props.grid,
  () => {
    if (reduced()) drawStatic()
    else start()
  },
)
</script>

<template>
  <canvas ref="canvas" class="flow" aria-hidden="true"></canvas>
</template>

<style scoped>
.flow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
