// 관측 지점 몇 개로 지도 전체의 바람장을 만드는 계산.
// 다른 모듈을 전혀 import 하지 않는 순수 함수 모음이라 Node에서 바로 검산할 수 있다.
//
// 좌표 약속: 화면 기준으로 x = 동쪽(+), y = 남쪽(+).
// 지도가 위도를 뒤집어 그리므로 화면 위쪽이 북쪽이다.

// OpenWeather의 wind.deg는 "바람이 불어오는 방향"(진북 기준 시계방향)이다.
// 화살표가 가리켜야 할 방향은 그 반대이므로 180도를 더한다.
export const toScreenVector = (speed, deg) => {
  const s = speed ?? 0
  const r = (((deg ?? 0) + 180) * Math.PI) / 180
  return { sx: s * Math.sin(r), sy: -s * Math.cos(r) }
}

// SVG rotate()에 그대로 넣는 각도.
// SVG 회전은 시계방향이고 화면 위쪽이 북쪽이므로,
// 북쪽을 향한 화살표를 이 각도만큼 돌리면 바람이 가는 방향을 가리킨다
export const toBearing = (sx, sy) => (Math.atan2(sx, -sy) * 180) / Math.PI

export const speedOf = (sx, sy) => Math.hypot(sx, sy)

// 역거리 가중(IDW).
// 각도를 직접 평균하면 359도와 1도의 평균이 180도가 되는 사고가 나므로
// 반드시 x·y 성분을 따로 평균한 뒤 다시 각도로 되돌린다.
const POWER = 3 // 2로 두면 관측점이 17개뿐이라 전역 평균에 수렴해 바람장이 밋밋해진다
const MIN_DIST = 12 // 관측점 위에서 1/d³이 발산하지 않도록 (12단위 ≈ 9km)

export const sampleWind = (stations, x, y) => {
  let wx = 0
  let wy = 0
  let total = 0
  for (const st of stations) {
    const dx = x - st.x
    const dy = y - st.y
    const d = Math.max(Math.sqrt(dx * dx + dy * dy), MIN_DIST)
    const w = 1 / (d * d * d)
    wx += st.sx * w
    wy += st.sy * w
    total += w
  }
  if (!total) return { sx: 0, sy: 0 }
  return { sx: wx / total, sy: wy / total }
}

// ── 격자 캐시 ──
// 입자 하나하나가 매 프레임 IDW를 돌리면 관측점 수 × 입자 수 × 60fps가 되어 감당이 안 된다.
// 격자에 미리 계산해 두고 입자는 네 꼭짓점을 섞어 쓰는 방식으로 바꾼다.
export const GRID_STEP = 20

export const buildWindGrid = (stations, width, height, step = GRID_STEP) => {
  const cols = Math.floor(width / step) + 1
  const rows = Math.floor(height / step) + 1
  const data = new Float32Array(cols * rows * 2)
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const { sx, sy } = sampleWind(stations, i * step, j * step)
      const k = (j * cols + i) * 2
      data[k] = sx
      data[k + 1] = sy
    }
  }
  return { cols, rows, step, data }
}

// 격자 네 점을 이중 선형 보간
export const sampleGrid = (grid, x, y) => {
  const { cols, rows, step, data } = grid
  const gx = Math.min(Math.max(x / step, 0), cols - 1)
  const gy = Math.min(Math.max(y / step, 0), rows - 1)
  const i = Math.min(Math.floor(gx), cols - 2)
  const j = Math.min(Math.floor(gy), rows - 2)
  const fx = gx - i
  const fy = gy - j

  const k00 = (j * cols + i) * 2
  const k10 = k00 + 2
  const k01 = ((j + 1) * cols + i) * 2
  const k11 = k01 + 2

  const mix = (a, b, t) => a + (b - a) * t
  const top = (k, l) => mix(data[k], data[l], fx)

  return {
    sx: mix(top(k00, k10), top(k01, k11), fy),
    sy: mix(top(k00 + 1, k10 + 1), top(k01 + 1, k11 + 1), fy),
  }
}
