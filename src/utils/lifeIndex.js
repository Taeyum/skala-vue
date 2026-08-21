// 날씨 데이터를 생활 의사결정으로 바꾸는 규칙 모음
// 컴포넌트는 판단하지 않고 여기서 나온 결과를 그리기만 한다 (과제 3의 원칙)
//
// 모든 지수는 같은 형태를 돌려준다
// { key, icon, title, level: 'good' | 'normal' | 'bad', label, desc }

// 3시간 예보에서 앞쪽 n구간만 자른다 (4구간 = 12시간)
const slice = (forecast, count) => (forecast ?? []).slice(0, count)

// 비·눈 구분용 강수 종류 (없으면 '비')
const precipWord = (main) => (main === 'Snow' ? '눈' : '비')

// 예보 시각을 "오후 3시" 형태로
const hourLabel = (dt) => {
  const h = new Date(dt * 1000).getHours()
  if (h === 0) return '자정'
  if (h === 12) return '정오'
  return h < 12 ? `오전 ${h}시` : `오후 ${h - 12}시`
}

// 예보 시각을 "오늘 / 내일 / 모레" + 시각으로
const dayHourLabel = (dt) => {
  const date = new Date(dt * 1000)
  const today = new Date()
  const diff = Math.round(
    (new Date(date.getFullYear(), date.getMonth(), date.getDate()) -
      new Date(today.getFullYear(), today.getMonth(), today.getDate())) /
      86400000,
  )
  const day = diff === 0 ? '오늘' : diff === 1 ? '내일' : diff === 2 ? '모레' : `${diff}일 뒤`
  return `${day} ${hourLabel(dt)}`
}

// ☂️ 우산 — 앞 12시간 강수확률
export const getUmbrellaIndex = (forecast) => {
  const next = slice(forecast, 4)
  const peak = next.reduce((acc, f) => (f.pop > (acc?.pop ?? -1) ? f : acc), null)
  const pop = peak?.pop ?? 0
  const word = precipWord(peak?.main)

  if (pop >= 60) {
    return {
      key: 'umbrella',
      icon: '☂️',
      title: '우산',
      level: 'bad',
      label: '필수',
      desc: `${hourLabel(peak.dt)} ${word} ${pop}%`,
    }
  }
  if (pop >= 30) {
    return {
      key: 'umbrella',
      icon: '☂️',
      title: '우산',
      level: 'normal',
      label: '챙기면 좋음',
      desc: `${hourLabel(peak.dt)} ${word} ${pop}%`,
    }
  }
  return {
    key: 'umbrella',
    icon: '☂️',
    title: '우산',
    level: 'good',
    label: '불필요',
    desc: next.length ? '12시간 내 강수 예보 없음' : '예보 정보 없음',
  }
}

// 🧺 빨래 — 습도·바람·앞 12시간 강수
export const getLaundryIndex = (current, forecast) => {
  const next = slice(forecast, 4)
  const rainPop = Math.max(0, ...next.map((f) => f.pop))
  const humidity = current?.humidity
  const wind = current?.windSpeed ?? 0

  if (humidity === null || humidity === undefined) {
    return {
      key: 'laundry',
      icon: '🧺',
      title: '빨래',
      level: 'normal',
      label: '--',
      desc: '습도 정보 없음',
    }
  }
  if (rainPop >= 30) {
    return {
      key: 'laundry',
      icon: '🧺',
      title: '빨래',
      level: 'bad',
      label: '부적합',
      desc: `강수확률 ${rainPop}%, 실내 건조 권장`,
    }
  }
  // 건조 점수: 습도가 낮을수록, 바람이 적당할수록 높다 (0~100)
  const score = (100 - humidity) * 0.6 + Math.min(wind, 5) * 8
  if (score >= 55) {
    return {
      key: 'laundry',
      icon: '🧺',
      title: '빨래',
      level: 'good',
      label: '좋음',
      desc: `습도 ${humidity}%, 바람 ${wind}m/s`,
    }
  }
  if (score >= 40) {
    return {
      key: 'laundry',
      icon: '🧺',
      title: '빨래',
      level: 'normal',
      label: '보통',
      desc: `습도 ${humidity}%, 건조에 시간 걸림`,
    }
  }
  return {
    key: 'laundry',
    icon: '🧺',
    title: '빨래',
    level: 'bad',
    label: '나쁨',
    desc: `습도 ${humidity}%로 잘 마르지 않음`,
  }
}

// 🚗 세차 — 앞 36시간 강수
export const getCarWashIndex = (forecast) => {
  const all = slice(forecast, 12)
  const wet = all.find((f) => f.pop >= 40)
  if (wet) {
    return {
      key: 'carwash',
      icon: '🚗',
      title: '세차',
      level: 'bad',
      label: '미루기',
      desc: `${dayHourLabel(wet.dt)} ${precipWord(wet.main)} 예보`,
    }
  }
  const damp = all.find((f) => f.pop >= 20)
  if (damp) {
    return {
      key: 'carwash',
      icon: '🚗',
      title: '세차',
      level: 'normal',
      label: '보통',
      desc: `${dayHourLabel(damp.dt)} 약한 강수 가능`,
    }
  }
  return {
    key: 'carwash',
    icon: '🚗',
    title: '세차',
    level: 'good',
    label: '좋음',
    desc: all.length ? '36시간 내 비 예보 없음' : '예보 정보 없음',
  }
}

// 🧥 옷차림 — 체감온도 7단계 + 바람
const OUTFIT = [
  { max: 0, label: '패딩·목도리', desc: '한파, 방한 필수' },
  { max: 5, label: '두꺼운 코트', desc: '기모 안감 추천' },
  { max: 9, label: '코트·니트', desc: '쌀쌀함' },
  { max: 16, label: '자켓·가디건', desc: '겉옷 하나' },
  { max: 22, label: '긴팔·얇은 겉옷', desc: '활동하기 좋음' },
  { max: 27, label: '반팔', desc: '더움' },
  { max: Infinity, label: '민소매·통풍 소재', desc: '무더위, 수분 보충' },
]

export const getOutfitIndex = (current) => {
  const feels = current?.feelsLike ?? current?.temp
  if (feels === null || feels === undefined) {
    return {
      key: 'outfit',
      icon: '🧥',
      title: '옷차림',
      level: 'normal',
      label: '--',
      desc: '기온 정보 없음',
    }
  }
  const step = OUTFIT.find((o) => feels <= o.max)
  const windy = (current?.windSpeed ?? 0) >= 7
  const level = feels <= 0 || feels >= 28 ? 'bad' : feels <= 9 || feels >= 23 ? 'normal' : 'good'
  return {
    key: 'outfit',
    icon: '🧥',
    title: '옷차림',
    level,
    label: step.label,
    desc: `체감 ${feels}°${windy ? ', 바람막이 추가' : `, ${step.desc}`}`,
  }
}

// 🌳 외출 — 대기질·체감·강수·바람 종합
export const getOutingIndex = (current, forecast, air) => {
  const feels = current?.feelsLike ?? current?.temp
  if (feels === null || feels === undefined) {
    return {
      key: 'outing',
      icon: '🌳',
      title: '외출',
      level: 'normal',
      label: '--',
      desc: '기온 정보 없음',
    }
  }
  const pop = Math.max(0, ...slice(forecast, 2).map((f) => f.pop))
  const aqi = air?.aqi ?? 2
  const wind = current?.windSpeed ?? 0

  // 감점 사유를 모아 가장 큰 것을 설명으로 쓴다
  const bad = []
  const warn = []
  if (aqi >= 4) bad.push(`대기질 ${air.label}`)
  else if (aqi === 3) warn.push('대기질 나쁨')
  if (pop >= 60) bad.push(`강수확률 ${pop}%`)
  else if (pop >= 30) warn.push(`강수확률 ${pop}%`)
  if (feels <= -5 || feels >= 33) bad.push(`체감 ${feels}°`)
  else if (feels <= 2 || feels >= 29) warn.push(`체감 ${feels}°`)
  if (wind >= 10) bad.push(`강풍 ${wind}m/s`)
  else if (wind >= 7) warn.push(`바람 ${wind}m/s`)

  if (bad.length) {
    return { key: 'outing', icon: '🌳', title: '외출', level: 'bad', label: '자제', desc: bad[0] }
  }
  if (warn.length) {
    return {
      key: 'outing',
      icon: '🌳',
      title: '외출',
      level: 'normal',
      label: '보통',
      desc: warn[0],
    }
  }
  return {
    key: 'outing',
    icon: '🌳',
    title: '외출',
    level: 'good',
    label: '좋음',
    desc: `체감 ${feels}°, 야외 활동 적합`,
  }
}

// 🪟 환기 — 대기질·강수
export const getVentilationIndex = (forecast, air) => {
  const aqi = air?.aqi
  const pop = Math.max(0, ...slice(forecast, 1).map((f) => f.pop))
  if (aqi === undefined || aqi === null) {
    return {
      key: 'vent',
      icon: '🪟',
      title: '환기',
      level: 'normal',
      label: '--',
      desc: '대기질 정보 없음',
    }
  }
  if (aqi >= 4) {
    return {
      key: 'vent',
      icon: '🪟',
      title: '환기',
      level: 'bad',
      label: '자제',
      desc: `초미세먼지 ${air.pm25}㎍/㎥`,
    }
  }
  if (aqi === 3 || pop >= 60) {
    return {
      key: 'vent',
      icon: '🪟',
      title: '환기',
      level: 'normal',
      label: '짧게',
      desc: aqi === 3 ? `미세먼지 ${air.pm10}㎍/㎥` : '비 예보, 짧게 환기',
    }
  }
  return {
    key: 'vent',
    icon: '🪟',
    title: '환기',
    level: 'good',
    label: '좋음',
    desc: `대기질 ${air.label}, 창문 열기 좋음`,
  }
}

// 여섯 지수를 한 번에
export const getLifeBriefing = (current, forecast, air) => [
  getUmbrellaIndex(forecast),
  getOutfitIndex(current),
  getOutingIndex(current, forecast, air),
  getLaundryIndex(current, forecast),
  getCarWashIndex(forecast),
  getVentilationIndex(forecast, air),
]

// 🕐 오늘 외출 최적 시간대 — 오늘 남은 3시간 구간을 채점해 가장 좋은 연속 구간을 찾는다
const scoreSlot = (f) => {
  let score = 100
  score -= f.pop * 0.8 // 비 올수록 감점
  const comfortGap = f.temp < 15 ? 15 - f.temp : f.temp > 24 ? f.temp - 24 : 0
  score -= comfortGap * 4 // 쾌적 구간(15~24°)에서 멀수록 감점
  score -= Math.max(0, f.windSpeed - 5) * 5 // 5m/s 초과 바람 감점
  return score
}

export const getBestOutingWindow = (forecast) => {
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)
  const slots = (forecast ?? []).filter((f) => f.dt * 1000 <= todayEnd.getTime())
  if (!slots.length) return null

  const scored = slots.map((f) => ({ ...f, score: scoreSlot(f) }))
  const best = scored.reduce((a, b) => (b.score > a.score ? b : a))
  if (best.score < 50) {
    return { start: null, end: null, good: false, reason: '오늘은 실내 활동 추천' }
  }

  // 최고점 구간에서 좌우로 60점 이상인 구간을 이어 붙인다
  const i = scored.indexOf(best)
  let s = i
  let e = i
  while (s > 0 && scored[s - 1].score >= 60) s--
  while (e < scored.length - 1 && scored[e + 1].score >= 60) e++

  const startH = new Date(scored[s].dt * 1000).getHours()
  // 오늘 구간만 다루므로 자정을 넘기지 않는다
  const endH = Math.min(new Date(scored[e].dt * 1000).getHours() + 3, 24)
  const reasons = [best.pop < 20 ? '비 없음' : `강수 ${best.pop}%`, `${best.temp}°`]
  return {
    start: startH,
    end: endH,
    good: true,
    reason: reasons.join(', '),
    label: `${startH}시 ~ ${endH === 24 ? '자정' : `${endH}시`}`,
  }
}

// 🗞️ 헤드라인 — 브리핑 전체를 한 문장으로
// 행동 지수(우산·옷차림·외출)의 나쁨 개수와 최적 시간대로 상황을 정한다
export const getBriefingHeadline = (briefing, bestWindow, current, air) => {
  const byKey = Object.fromEntries(briefing.map((b) => [b.key, b]))
  const action = ['umbrella', 'outfit', 'outing'].map((k) => byKey[k])
  const badCount = action.filter((b) => b.level === 'bad').length
  const hasData = action.some((b) => b.label !== '--')

  // 근거: 강수 → 체감 → 대기질 순으로 최대 3개
  const facts = []
  if (byKey.umbrella.level !== 'good' && byKey.umbrella.label !== '--') {
    facts.push(byKey.umbrella.desc)
  }
  const feels = current?.feelsLike ?? current?.temp
  if (feels !== null && feels !== undefined) facts.push(`체감 ${feels}°`)
  if (air?.label) facts.push(`대기질 ${air.label}`)

  if (!hasData) {
    return { icon: '⏳', level: 'normal', title: '정보를 불러오는 중', facts: [] }
  }
  if (badCount >= 2 || (bestWindow && !bestWindow.good)) {
    return { icon: '🏠', level: 'bad', title: '오늘은 실내가 편하겠어요', facts }
  }
  if (bestWindow?.good) {
    return {
      icon: '🚶',
      level: 'good',
      title: `오늘 외출은 ${bestWindow.label}가 좋아요`,
      facts,
    }
  }
  if (badCount === 1) {
    const culprit = action.find((b) => b.level === 'bad')
    return { icon: '⚠️', level: 'normal', title: `${culprit.title}만 신경 쓰면 돼요`, facts }
  }
  return { icon: '👍', level: 'good', title: '무난한 하루예요', facts }
}
