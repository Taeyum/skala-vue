<script setup>
import { computed } from 'vue'
import { getLifeBriefing, getBestOutingWindow, getBriefingHeadline } from '@/utils/lifeIndex.js'

const props = defineProps({
  city: { type: Object, default: null }, // weatherStore 항목 (현재 날씨)
  forecast: { type: Array, default: () => [] }, // forecastStore 3시간 예보
  air: { type: Object, default: null }, // airStore 대기질
  // 'full' = 헤드라인 + 행동 3 + 참고 3 (상세 패널)
  // 'hero' = 헤드라인 + 행동 3 가로 배치 (홈 히어로)
  // 'compact' = 키 목록만 칩으로
  mode: { type: String, default: 'full' },
  keys: { type: Array, default: () => ['umbrella', 'outfit'] },
})

// 나가기 전에 결정할 것 / 집에서 할 것
const ACTION_KEYS = ['umbrella', 'outfit', 'outing']
const HOME_KEYS = ['laundry', 'carwash', 'vent']

// 입력이 바뀔 때만 재계산 — 판단은 utils, 여기선 그리기만
const briefing = computed(() => getLifeBriefing(props.city, props.forecast, props.air))
const bestWindow = computed(() => getBestOutingWindow(props.forecast))
const headline = computed(() =>
  getBriefingHeadline(briefing.value, bestWindow.value, props.city, props.air),
)

const pick = (keys) => keys.map((k) => briefing.value.find((b) => b.key === k))
const actionItems = computed(() => pick(ACTION_KEYS))
const homeItems = computed(() => pick(HOME_KEYS))
const chipItems = computed(() => pick(props.keys))
</script>

<template>
  <!-- 홈 히어로용: 짧은 칩 -->
  <div v-if="mode === 'compact'" class="chips">
    <span v-for="b in chipItems" :key="b.key" class="chip" :class="b.level">
      <span class="chip-icon">{{ b.icon }}</span>
      <span class="chip-title">{{ b.title }}</span>
      <strong>{{ b.label }}</strong>
    </span>
  </div>

  <!-- 홈 히어로용: 헤드라인 + 행동 3개를 한 줄에 -->
  <div v-else-if="mode === 'hero'" class="hero-brief">
    <div class="headline hero-headline" :class="headline.level">
      <span class="headline-icon">{{ headline.icon }}</span>
      <div class="headline-text">
        <p class="headline-title">{{ headline.title }}</p>
        <p v-if="headline.facts.length" class="headline-facts">
          <span v-for="(f, i) in headline.facts" :key="i">{{ f }}</span>
        </p>
      </div>
    </div>
    <ul class="actions hero-actions">
      <li v-for="b in actionItems" :key="b.key" class="action hero-action" :class="b.level">
        <span class="action-icon">{{ b.icon }}</span>
        <div class="hero-action-text">
          <span class="action-title">{{ b.title }}</span>
          <strong class="action-label">{{ b.label }}</strong>
          <span class="action-desc">{{ b.desc }}</span>
        </div>
      </li>
    </ul>
  </div>

  <!-- 상세 패널용 -->
  <div v-else class="briefing">
    <!-- ① 헤드라인: 오늘을 한 문장으로 -->
    <header class="headline" :class="headline.level">
      <span class="headline-icon">{{ headline.icon }}</span>
      <div class="headline-text">
        <p class="headline-title">{{ headline.title }}</p>
        <p v-if="headline.facts.length" class="headline-facts">
          <span v-for="(f, i) in headline.facts" :key="i">{{ f }}</span>
        </p>
      </div>
      <ul class="dots" aria-label="지수 요약">
        <li
          v-for="b in briefing"
          :key="b.key"
          :class="b.level"
          :title="`${b.title} ${b.label}`"
        ></li>
      </ul>
    </header>

    <!-- ② 행동 지수: 나가기 전에 결정할 것 -->
    <ul class="actions">
      <li v-for="b in actionItems" :key="b.key" class="action" :class="b.level">
        <span class="action-icon">{{ b.icon }}</span>
        <span class="action-title">{{ b.title }}</span>
        <strong class="action-label">{{ b.label }}</strong>
        <span class="action-desc">{{ b.desc }}</span>
      </li>
    </ul>

    <!-- ③ 참고 지수: 집에서 할 것 -->
    <ul class="rows">
      <li v-for="b in homeItems" :key="b.key" class="row" :class="b.level">
        <span class="row-icon">{{ b.icon }}</span>
        <span class="row-title">{{ b.title }}</span>
        <strong class="row-label">{{ b.label }}</strong>
        <span class="row-desc">{{ b.desc }}</span>
        <span class="row-dot"></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 등급 색 — 대기질 배지와 같은 팔레트 */
.good {
  --lv: #00b894;
  --lv-soft: rgba(0, 184, 148, 0.16);
}
.normal {
  --lv: #fdcb6e;
  --lv-soft: rgba(253, 203, 110, 0.16);
}
.bad {
  --lv: #ff7675;
  --lv-soft: rgba(255, 118, 117, 0.16);
}

.briefing {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

/* ── ① 헤드라인 ── */
.headline {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 14px var(--sp-4);
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--lv-soft), rgba(255, 255, 255, 0.04));
  border: 1px solid var(--lv-soft);
}

.headline-icon {
  font-size: 30px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.headline-text {
  flex: 1;
  min-width: 0;
}

.headline-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
  letter-spacing: -0.2px;
}

.headline-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--sp-2);
  margin: 3px 0 0;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.7);
}

.headline-facts span + span::before {
  content: '·';
  margin-right: var(--sp-2);
  color: rgba(255, 255, 255, 0.4);
}

.dots {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dots li {
  width: 14px;
  height: 4px;
  border-radius: 2px;
  background: var(--lv);
  opacity: 0.9;
}

/* ── ② 행동 지수 ── */
.actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
  padding: 14px 10px 12px;
  border-radius: var(--r-md);
  background: var(--lv-soft);
  border: 1px solid transparent;
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.action:hover {
  transform: translateY(-2px);
  border-color: var(--lv);
}

.action-icon {
  font-size: 28px;
  line-height: 1;
  margin-bottom: 6px;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
}

.action-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
}

.action-label {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
}

.action-desc {
  margin-top: 2px;
  font-size: 11px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.6);
}

/* ── ③ 참고 지수 ── */
.rows {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 9px 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: var(--fs-sm);
}

.row:last-child {
  border-bottom: none;
}

.row-icon {
  width: 22px;
  font-size: 15px;
  text-align: center;
}

.row-title {
  width: 34px;
  color: rgba(255, 255, 255, 0.7);
}

.row-label {
  width: 56px;
  color: #fff;
}

.row-desc {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.55);
}

.row-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--lv);
  box-shadow: 0 0 0 3px var(--lv-soft);
}

/* ── 홈 히어로 ── */
.hero-brief {
  display: flex;
  align-items: stretch;
  gap: var(--sp-3);
}

.hero-headline {
  flex: 0 0 320px;
  background: rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.hero-headline .headline-title {
  font-size: var(--fs-h2);
}

.hero-actions {
  flex: 1;
  min-width: 0;
}

.hero-action {
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.18);
  border-left: 3px solid var(--lv);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.hero-action:hover {
  border-color: rgba(255, 255, 255, 0.18);
  border-left-color: var(--lv);
  background: rgba(0, 0, 0, 0.3);
}

.hero-action .action-icon {
  font-size: 24px;
  margin-bottom: 0;
}

.hero-action-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.hero-action-text .action-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 홈 히어로 칩 ── */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px var(--sp-3) 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--r-pill);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.85);
}

.chip::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--lv);
}

.chip-icon {
  font-size: var(--fs-sm);
}

.chip strong {
  color: #fff;
}
</style>
