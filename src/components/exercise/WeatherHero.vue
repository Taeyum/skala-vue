<script setup>
defineProps({
  city: { type: Object, default: null },
  displayTemp: { type: [Number, String], default: null },
  unit: { type: String, default: '℃' },
  // 부모가 계산해 내려주는 현지 시각·일출·일몰 문자열 (자식은 그리기만)
  localTime: { type: String, default: null },
  sunrise: { type: String, default: null },
  sunset: { type: String, default: null },
  night: { type: Boolean, default: false },
  // 히어로 상단 작은 라벨 ("현재 선택한 지역" / "내일 오후 3시 예보")
  label: { type: String, default: '현재 선택한 지역' },
})

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@4x.png`
</script>

<template>
  <section class="hero">
    <div v-if="city" class="hero-inner">
      <div class="hero-left">
        <p class="hero-label">{{ label }}</p>
        <h1 class="hero-city">{{ city.name }}</h1>
        <p class="hero-status">
          {{ city.status }}
          <template v-if="localTime">
            <span class="dot">·</span>
            <span class="local-time">{{ night ? '🌙' : '☀️' }} 현지 {{ localTime }}</span>
          </template>
        </p>
      </div>

      <div class="hero-center">
        <img v-if="city.icon" :src="iconUrl(city.icon)" alt="" class="hero-icon" />
        <span class="hero-temp"
          >{{ displayTemp ?? '--' }}<span class="unit">{{ unit }}</span></span
        >
      </div>

      <div class="hero-right">
        <div class="stat">
          <span class="stat-label">체감</span>
          <span class="stat-value">{{ city.feelsLike ?? '--' }}{{ unit }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">습도</span>
          <span class="stat-value">{{ city.humidity ?? '--' }}%</span>
        </div>
        <div class="stat">
          <span class="stat-label">풍속</span>
          <span class="stat-value">{{ city.windSpeed ?? '--' }}m/s</span>
        </div>
        <div class="stat">
          <span class="stat-label">구름</span>
          <span class="stat-value">{{ city.clouds ?? '--' }}%</span>
        </div>
        <div class="stat">
          <span class="stat-label">일출</span>
          <span class="stat-value">{{ sunrise ?? '--' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">일몰</span>
          <span class="stat-value">{{ sunset ?? '--' }}</span>
        </div>
      </div>
    </div>

    <!-- 생활 브리핑 등 부가 정보 (부모 스코프에서 채움) -->
    <div v-if="city && $slots.extra" class="hero-extra">
      <slot name="extra"></slot>
    </div>

    <!-- 히어로 하단 컨트롤 (시간여행 스트립) — 히어로를 조작하므로 같은 카드 안에 둔다 -->
    <div v-if="city && $slots.footer" class="hero-footer">
      <slot name="footer"></slot>
    </div>

    <div v-if="!city" class="hero-empty">
      <p>아래 목록에서 지역을 선택해 주세요.</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: auto;
  padding: var(--sp-8);
  border-radius: var(--r-md); /* 바깥 .dashboard(20px) 안에 있으므로 한 단계 작게 */
  color: #fff;
}

.hero-inner {
  display: flex;
  align-items: center;
  gap: var(--sp-10);
}

.hero-left {
  flex: 1;
}

.hero-label {
  margin: 0;
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
}

.hero-city {
  margin: 6px 0 var(--sp-1);
  font-size: var(--fs-display);
  font-weight: 700;
  color: #fff;
}

.hero-status {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
}

.hero-extra {
  margin-top: var(--sp-6);
  padding-top: var(--sp-5);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-footer {
  position: relative;
  z-index: 1; /* 대시보드의 비·눈 애니메이션 레이어 위에 */
  margin-top: var(--sp-5);
  padding: var(--sp-3) var(--sp-4) var(--sp-2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--r-md);
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.hero-center {
  display: flex;
  align-items: center;
}

.hero-icon {
  width: 110px;
  height: 110px;
}

.hero-temp {
  font-size: 84px;
  font-weight: 700;
  line-height: 1;
}

.unit {
  font-size: 36px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
}

.hero-right {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 10px var(--sp-6);
}

.dot {
  margin: 0 6px;
  color: rgba(255, 255, 255, 0.5);
}

.local-time {
  color: rgba(255, 255, 255, 0.9);
  font-variant-numeric: tabular-nums;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: var(--fs-xs);
  color: rgba(255, 255, 255, 0.65);
}

.stat-value {
  font-size: 17px;
  font-weight: 700;
}

.hero-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
