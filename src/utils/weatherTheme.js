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

// 기본값 (조회 실패나 목록에 없는 상태)
export const DEFAULT_GRADIENT = 'linear-gradient(160deg, #dfe6e9, #f5f6fa)'

export const getGradient = (main) => WEATHER_GRADIENT[main] ?? DEFAULT_GRADIENT

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

export const getPexelsQuery = (main) => PEXELS_QUERY[main] ?? 'weather sky'

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