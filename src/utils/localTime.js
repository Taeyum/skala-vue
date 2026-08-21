// 도시의 현지 시각과 낮/밤 판정
// OpenWeather 응답의 timezone(UTC 오프셋, 초)과 sunrise/sunset(UTC 타임스탬프)만 사용한다

// 현지 "지금"을 Date로 — 오프셋을 더한 뒤 UTC 메서드로 읽으면 현지 값이 나온다
export const getLocalDate = (timezone, now = Date.now()) => new Date(now + (timezone ?? 0) * 1000)

const pad = (n) => String(n).padStart(2, '0')

// "오후 9:42"
export const formatLocalTime = (timezone, now = Date.now()) => {
  if (timezone === null || timezone === undefined) return null
  const d = getLocalDate(timezone, now)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const period = h < 12 ? '오전' : '오후'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${period} ${h12}:${pad(m)}`
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// "8월 21일 목요일"
export const formatLocalDate = (timezone, now = Date.now()) => {
  if (timezone === null || timezone === undefined) return null
  const d = getLocalDate(timezone, now)
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 ${WEEKDAYS[d.getUTCDay()]}요일`
}

// 타임스탬프(UTC 초)를 현지 "오전 5:48" 로
export const formatStamp = (stamp, timezone) => {
  if (!stamp) return null
  return formatLocalTime(timezone, stamp * 1000)
}

// 지금이 일몰~일출 사이인가 — 타임스탬프끼리 비교하므로 타임존과 무관
export const isNight = (sunrise, sunset, now = Date.now()) => {
  if (!sunrise || !sunset) return false
  const t = now / 1000
  return t < sunrise || t >= sunset
}

// "2시간 13분" / "45분"
const formatDuration = (seconds) => {
  const total = Math.max(0, Math.round(seconds / 60))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}분`
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`
}

// 해·달 상태 요약
// { night, nextEvent: 'sunrise' | 'sunset', remaining: '2시간 13분', progress: 0~1,
//   sunriseText, sunsetText }
export const getSunPhase = (sunrise, sunset, timezone, now = Date.now()) => {
  if (!sunrise || !sunset) return null
  const t = now / 1000
  const night = isNight(sunrise, sunset, now)
  const DAY = 86400

  let start
  let end
  let nextEvent
  if (!night) {
    start = sunrise
    end = sunset
    nextEvent = 'sunset'
  } else if (t >= sunset) {
    // 오늘 일몰 뒤 → 내일 일출까지 (하루 뒤로 근사)
    start = sunset
    end = sunrise + DAY
    nextEvent = 'sunrise'
  } else {
    // 오늘 일출 전 → 어제 일몰부터 오늘 일출까지
    start = sunset - DAY
    end = sunrise
    nextEvent = 'sunrise'
  }

  const progress = Math.min(1, Math.max(0, (t - start) / (end - start)))
  return {
    night,
    nextEvent,
    remaining: formatDuration(end - t),
    progress,
    sunriseText: formatStamp(sunrise, timezone),
    sunsetText: formatStamp(sunset, timezone),
  }
}

// 임의 시각(at, ms)의 낮·밤 — 오늘 일출·일몰을 그 날짜로 평행이동해서 비교한다
// (예보는 최대 5일 뒤라 일출 시각 오차는 몇 분 수준)
export const isNightAt = (sunrise, sunset, at) => {
  if (!sunrise || !sunset) return false
  const DAY = 86400
  const t = at / 1000
  const shift = Math.floor((t - sunrise) / DAY) * DAY
  const rise = sunrise + shift
  const set = sunset + shift
  return t < rise || t >= set
}

// 예보 슬롯의 현지 라벨 { day: '오늘' | '내일' | '모레' | '금요일', time: '오후 3시' }
export const describeSlot = (dt, timezone, now = Date.now()) => {
  const d = getLocalDate(timezone, dt * 1000)
  const today = getLocalDate(timezone, now)
  const dayIndex = (x) =>
    Math.floor(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()) / 86400000)
  const diff = dayIndex(d) - dayIndex(today)
  const day =
    diff === 0
      ? '오늘'
      : diff === 1
        ? '내일'
        : diff === 2
          ? '모레'
          : `${WEEKDAYS[d.getUTCDay()]}요일`
  const h = d.getUTCHours()
  const time = h === 0 ? '자정' : h === 12 ? '정오' : h < 12 ? `오전 ${h}시` : `오후 ${h - 12}시`
  return { day, time, diff, hour: h }
}
