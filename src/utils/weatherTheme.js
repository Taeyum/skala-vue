export const WEATHER_GRADIENT = {
  Clear: 'linear-gradient(160deg, #74b9ff, #dff1ff)',
  Clouds: 'linear-gradient(160deg, #8395a7, #c8d6e5)',
  Rain: 'linear-gradient(160deg, #576574, #a4b0be)',
  Drizzle: 'linear-gradient(160deg, #6a89a7, #b8cddb)',
  Thunderstorm: 'linear-gradient(160deg, #3d4451, #7f8c8d)',
  Snow: 'linear-gradient(160deg, #a4b0be, #f1f2f6)',
  Mist: 'linear-gradient(160deg, #95a5a6, #dfe4ea)',
  Fog: 'linear-gradient(160deg, #95a5a6, #dfe4ea)',
  Haze: 'linear-gradient(160deg, #a49f8b, #e5e1d5)',
}

// 야간 팔레트 — 같은 날씨라도 일몰 뒤에는 어둡게
export const WEATHER_GRADIENT_NIGHT = {
  Clear: 'linear-gradient(160deg, #0f2027, #203a43 55%, #2c5364)',
  Clouds: 'linear-gradient(160deg, #232526, #414345)',
  Rain: 'linear-gradient(160deg, #141e30, #243b55)',
  Drizzle: 'linear-gradient(160deg, #1c2833, #34495e)',
  Thunderstorm: 'linear-gradient(160deg, #0b0f1a, #2c3e50)',
  Snow: 'linear-gradient(160deg, #2c3e50, #4b6584)',
  Mist: 'linear-gradient(160deg, #2f3640, #535c68)',
  Fog: 'linear-gradient(160deg, #2f3640, #535c68)',
  Haze: 'linear-gradient(160deg, #3d3d3d, #5c5c5c)',
}

// 기본값 (조회 실패나 목록에 없는 상태)
export const DEFAULT_GRADIENT = 'linear-gradient(160deg, #dfe6e9, #f5f6fa)'
export const DEFAULT_GRADIENT_NIGHT = 'linear-gradient(160deg, #1e272e, #485460)'

export const getGradient = (main, isNight = false) =>
  isNight
    ? (WEATHER_GRADIENT_NIGHT[main] ?? DEFAULT_GRADIENT_NIGHT)
    : (WEATHER_GRADIENT[main] ?? DEFAULT_GRADIENT)

// OpenWeather main 값 → Pexels 검색어
export const PEXELS_QUERY = {
  Clear: 'clear blue sky',
  Clouds: 'cloudy sky',
  Rain: 'rainy window',
  Drizzle: 'light rain',
  Thunderstorm: 'thunderstorm',
  Snow: 'snow landscape',
  Mist: 'foggy morning',
  Fog: 'foggy morning',
  Haze: 'hazy sky',
}

// 야간용 검색어 — 캐시 키가 검색어라 낮/밤 영상이 따로 캐시된다
export const PEXELS_QUERY_NIGHT = {
  Clear: 'starry night sky',
  Clouds: 'night clouds moon',
  Rain: 'rainy night city',
  Drizzle: 'rainy night street',
  Thunderstorm: 'lightning night',
  Snow: 'snow falling night',
  Mist: 'foggy night',
  Fog: 'foggy night',
  Haze: 'city lights night',
}

export const getPexelsQuery = (main, isNight = false) =>
  isNight ? (PEXELS_QUERY_NIGHT[main] ?? 'night sky') : (PEXELS_QUERY[main] ?? 'weather sky')

// OpenWeather의 상세 description을 자연스러운 한글로 매핑
// 키는 응답의 weather[0].id (기상 코드)
const WEATHER_TEXT = {
  // 2xx 뇌우
  200: '가벼운 비를 동반한 천둥번개',
  201: '비를 동반한 천둥번개',
  202: '폭우를 동반한 천둥번개',
  210: '약한 천둥번개',
  211: '천둥번개',
  212: '강한 천둥번개',
  221: '불규칙한 천둥번개',
  230: '이슬비를 동반한 천둥번개',
  231: '이슬비를 동반한 천둥번개',
  232: '강한 이슬비를 동반한 천둥번개',

  // 3xx 이슬비
  300: '가벼운 이슬비',
  301: '이슬비',
  302: '강한 이슬비',
  310: '가벼운 이슬비',
  311: '이슬비',
  312: '강한 이슬비',
  313: '소나기성 이슬비',
  314: '강한 소나기성 이슬비',
  321: '소나기성 이슬비',

  // 5xx 비
  500: '약한 비',
  501: '비',
  502: '강한 비',
  503: '매우 강한 비',
  504: '폭우',
  511: '어는 비',
  520: '약한 소나기',
  521: '소나기',
  522: '강한 소나기',
  531: '불규칙한 소나기',

  // 6xx 눈
  600: '약한 눈',
  601: '눈',
  602: '많은 눈',
  611: '진눈깨비',
  612: '약한 진눈깨비',
  613: '진눈깨비',
  615: '비와 약한 눈',
  616: '비와 눈',
  620: '약한 눈날림',
  621: '눈날림',
  622: '강한 눈날림',

  // 7xx 대기 현상
  701: '옅은 안개',
  711: '연무',
  721: '실안개',
  731: '모래 먼지',
  741: '안개',
  751: '모래',
  761: '먼지',
  762: '화산재',
  771: '돌풍',
  781: '토네이도',

  // 800 맑음
  800: '맑음',

  // 80x 구름
  801: '구름 조금',
  802: '구름 많음',
  803: '대체로 흐림',
  804: '흐림',
}

export const getWeatherText = (id, fallback) => WEATHER_TEXT[id] ?? fallback ?? '알 수 없음'

// ── 온도 → 단색 (지도 시도 채색용) ──
// 그라디언트 문자열은 SVG fill에 못 쓰기 때문에 hex를 돌려주는 함수를 따로 둔다.
// 16도(쾌적)를 중립축으로 하는 발산형. 한국 기온 -15~40도를 덮는다
export const TEMP_STOPS = [
  [-15, '#2c3e8f'],
  [-5, '#3f7fd0'],
  [0, '#61a5e8'],
  [5, '#7fc7d9'],
  [10, '#8fd4a8'],
  [16, '#d6de85'],
  [22, '#f5c14f'],
  [28, '#ef8f3c'],
  [34, '#e05a3a'],
  [40, '#b4232c'],
]

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]

const rgbToHex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

const NIGHT_TINT = [0x10, 0x1a, 0x2b]
// 40%까지 섞으면 밤에 시도 구분이 안 될 만큼 어두워져 25%로 낮췄다
const NIGHT_MIX = 0.25

export const getTempColor = (celsius, isNight = false) => {
  // 관측이 없는 도시에 색을 지어내지 않는다 (생활 브리핑에서 '--'를 둔 것과 같은 이유)
  if (celsius === null || celsius === undefined || Number.isNaN(Number(celsius))) {
    return isNight ? '#2a3442' : '#6b7a8c'
  }

  const t = Number(celsius)
  let rgb
  if (t <= TEMP_STOPS[0][0]) {
    rgb = hexToRgb(TEMP_STOPS[0][1])
  } else if (t >= TEMP_STOPS.at(-1)[0]) {
    rgb = hexToRgb(TEMP_STOPS.at(-1)[1])
  } else {
    const i = TEMP_STOPS.findIndex(([stop]) => t < stop)
    const [t0, c0] = TEMP_STOPS[i - 1]
    const [t1, c1] = TEMP_STOPS[i]
    const ratio = (t - t0) / (t1 - t0)
    const [a, b] = [hexToRgb(c0), hexToRgb(c1)]
    rgb = a.map((v, k) => v + (b[k] - v) * ratio)
  }

  // 야간은 별도 팔레트를 두지 않고 딥네이비를 섞는다.
  // 색상 순서가 그대로 남아서 범례 하나로 낮·밤을 모두 읽을 수 있다
  if (isNight) {
    rgb = rgb.map((v, k) => v * (1 - NIGHT_MIX) + NIGHT_TINT[k] * NIGHT_MIX)
  }
  return rgbToHex(rgb)
}

// 바람 세기 → 색 (화살표·범례용). 3단계로 끊어 캔버스 드로우 콜도 이 기준으로 묶는다
export const WIND_LEVELS = [
  { max: 4, label: '약함', color: 'rgba(168, 206, 255, 0.62)' },
  { max: 9, label: '보통', color: 'rgba(214, 234, 255, 0.82)' },
  { max: Infinity, label: '강함', color: 'rgba(255, 255, 255, 0.95)' },
]

export const getWindColor = (speed) =>
  WIND_LEVELS.find((l) => (speed ?? 0) < l.max).color
