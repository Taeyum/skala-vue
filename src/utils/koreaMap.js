// 한국 시도 경계를 SVG로 그리기 위한 좌표 변환과 상수.
//
// 경계 데이터: southkorea/southkorea-maps — kostat/2013/json/skorea_provinces_geo_simple.json
// 제공: 통계청(KOSTAT), 자유롭게 공유·변형 가능. 좌표계 WGS84(EPSG:4326)
// 원본 143KB를 소수점 5자리로 반올림해 78KB로 줄여 두었다 (전국 축척에서 차이 없음)
//
// 2013년 기준이라 강원도·전라북도가 특별자치도 개편 이전 이름이지만 경계는 같다.
import geo from '@/assets/skorea-provinces.geo.json'

const RAD = Math.PI / 180

// ── 투영 ──
// 메르카토르를 쓴다. 단순 선형 변환은 위도 36도에서 가로가 눌리고(w/h 1.16),
// 등장방형에 cos(기준위도)를 곱하는 방식은 위도마다 x 축척이 어긋나
// 바람 화살표의 회전각이 최대 2도 전단된다.
// 메르카토르는 등각이라 어느 지점에서나 x·y 축척이 같고, 그래서
// "북쪽을 향한 화살표를 rotate(방위각)" 이라는 단순한 규칙이 정확히 성립한다.
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2))

// 실측 bbox(경도 124.61331~130.92109, 위도 33.19065~38.61101)에 여백을 준 값.
// 데이터가 고정이므로 런타임에 계산하지 않는다 — 지도 크기가 흔들릴 이유가 없다
const LON_MIN = 124.5
const LON_MAX = 131.0
const LAT_MIN = 33.0
const LAT_MAX = 38.7

export const VIEW_W = 800
const X0 = LON_MIN * RAD
const Y0 = mercY(LAT_MAX)
const K = VIEW_W / ((LON_MAX - LON_MIN) * RAD)
export const VIEW_H = Math.round((Y0 - mercY(LAT_MIN)) * K)

// 화면 축: x = 동쪽(+), y = 남쪽(+). SVG는 아래로 갈수록 y가 커지므로 위도를 뒤집는다
export const projectX = (lon) => (lon * RAD - X0) * K
export const projectY = (lat) => (Y0 - mercY(lat)) * K

// ── GeoJSON → SVG path ──
// Polygon은 [ring...], MultiPolygon은 [[ring...]...] 이므로 형태를 하나로 맞춘다
const toPolygons = (geometry) =>
  geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates

const ringToPath = (ring) =>
  ring
    .map(
      ([lon, lat], i) => `${i ? 'L' : 'M'}${projectX(lon).toFixed(1)},${projectY(lat).toFixed(1)}`,
    )
    .join('') + 'Z'

// 한 시도의 모든 링(바깥 + 구멍)을 이어 붙인 하나의 d 문자열.
// 전남 안의 광주처럼 도려낸 구멍은 fill-rule="evenodd"가 알아서 처리한다
const featureToPath = (feature) => toPolygons(feature.geometry).flat().map(ringToPath).join('')

// 모듈이 처음 로드될 때 한 번만 변환한다 (3,681정점, 2ms 남짓)
export const PROVINCES = geo.features.map((f) => ({
  code: f.properties.code,
  name: f.properties.name,
  d: featureToPath(f),
}))

// 바다만 칠하는 path. 지도를 덮는 사각형에 모든 시도 링을 이어 붙이고 evenodd를 걸면
// 육지가 뚫린 마스크가 된다. 입자 캔버스 위에 이걸 얹으면 바다로 나간 입자가 가려진다.
// (캔버스에서 매 프레임 clip을 거는 것보다 훨씬 싸다 — 정적 path 하나면 끝난다)
export const SEA_PATH =
  `M-40,-40H${VIEW_W + 40}V${VIEW_H + 40}H-40Z` + PROVINCES.map((p) => p.d).join('')

// ── 육지 판정 ──
// 링을 화면 좌표로 미리 바꿔 두고 bbox도 함께 들고 있는다.
// bbox로 먼저 거르면 섬이 많은 전남(61개 폴리곤)에서 대부분의 링을 건너뛴다
const LAND_RINGS = geo.features.flatMap((f) =>
  toPolygons(f.geometry)
    .flat()
    .map((ring) => {
      const pts = ring.map(([lon, lat]) => [projectX(lon), projectY(lat)])
      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity
      for (const [x, y] of pts) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
      return { pts, minX, maxX, minY, maxY }
    }),
)

// 광선투사. 모든 링을 짝·홀로 토글하므로 구멍이 저절로 맞는다 —
// 광주 안의 점은 전남 바깥고리 + 전남 구멍 + 광주 바깥고리 = 3회(홀수) = 육지
export const pointInLand = (x, y) => {
  let inside = false
  for (const ring of LAND_RINGS) {
    if (y < ring.minY || y > ring.maxY || x < ring.minX || x > ring.maxX) continue
    const pts = ring.pts
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i]
      const [xj, yj] = pts[j]
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside
      }
    }
  }
  return inside
}

// ── 바람 화살표를 놓을 자리 ──
// 위치는 시간이 지나도 변하지 않고 방향만 바뀌므로 모듈 로드 때 한 번만 골라 둔다
export const ARROW_STEP = 48

export const ARROW_CELLS = (() => {
  const cells = []
  for (let y = ARROW_STEP / 2; y < VIEW_H; y += ARROW_STEP) {
    for (let x = ARROW_STEP / 2; x < VIEW_W; x += ARROW_STEP) {
      if (pointInLand(x, y)) cells.push({ x, y })
    }
  }
  return cells
})()

// ── 도시 ↔ 시도 매핑과 마커 배치 ──
// offset: 마커 칩을 점에서 얼마나 비켜 놓을지 (viewBox 단위).
// 세종·대전이 27.7단위(화면 18px)까지 붙어 있어 칩을 그대로 두면 서로 덮는다.
// 점은 실제 좌표에 남기고 칩만 밀어낸 뒤 지시선으로 잇는다.
export const MAP_POINTS = [
  { id: 'city_01', code: '11', offset: [-8, -34] }, // 서울
  { id: 'city_02', code: '31', offset: [10, 34] }, // 수원 · 경기
  { id: 'city_03', code: '21', offset: [34, 20] }, // 부산
  { id: 'city_04', code: '32', offset: [30, -20] }, // 강릉 · 강원
  { id: 'city_05', code: '25', offset: [26, 32] }, // 대전
  { id: 'city_06', code: '39', offset: [0, -34] }, // 제주
  { id: 'city_07', code: '23', offset: [-46, 10] }, // 인천
  { id: 'city_08', code: '22', offset: [26, -24] }, // 대구
  { id: 'city_09', code: '24', offset: [32, -6] }, // 광주
  { id: 'city_10', code: '26', offset: [36, -14] }, // 울산
  { id: 'city_11', code: '29', offset: [-48, 6] }, // 세종
  { id: 'city_12', code: '33', offset: [44, -20] }, // 청주 · 충북
  { id: 'city_13', code: '34', offset: [-46, -34] }, // 홍성 · 충남 (세종 칩과 세로로 벌린다)
  { id: 'city_14', code: '35', offset: [-30, 22] }, // 전주 · 전북
  { id: 'city_15', code: '36', offset: [-38, 12] }, // 목포 · 전남
  { id: 'city_16', code: '37', offset: [34, -18] }, // 안동 · 경북
  { id: 'city_17', code: '38', offset: [-34, 26] }, // 창원 · 경남
]

const POINT_BY_ID = new Map(MAP_POINTS.map((p) => [p.id, p]))

// 사용자가 검색으로 추가한 도시는 여기 없다 → 지도에 그리지 않는다.
// 도쿄를 추가해도 한국 지도가 깨지지 않는다
export const getMapPoint = (cityId) => POINT_BY_ID.get(cityId) ?? null

export const PROVINCE_BY_CITY = Object.fromEntries(MAP_POINTS.map((p) => [p.id, p.code]))
export const CITY_BY_PROVINCE = Object.fromEntries(MAP_POINTS.map((p) => [p.code, p.id]))
