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