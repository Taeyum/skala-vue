<script setup>
defineProps({
  city: { type: Object, default: null },
  displayTemp: { type: [Number, String], default: null },
  unit: { type: String, default: '℃' },
})

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@4x.png`
</script>

<template>
  <section class="hero">
    <div v-if="city" class="hero-inner">
      <div class="hero-left">
        <p class="hero-label">현재 선택한 지역</p>
        <h1 class="hero-city">{{ city.name }}</h1>
        <p class="hero-status">{{ city.status }}</p>
      </div>

      <div class="hero-center">
        <img v-if="city.icon" :src="iconUrl(city.icon)" alt="" class="hero-icon" />
        <span class="hero-temp">{{ displayTemp ?? '--' }}<span class="unit">{{ unit }}</span></span>
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
      </div>
    </div>

    <div v-else class="hero-empty">
      <p>아래 목록에서 지역을 선택해 주세요.</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: auto;
  padding: var(--sp-8);
  border-radius: var(--r-lg);
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
  grid-template-columns: repeat(2, 1fr);
  gap: 10px var(--sp-6);
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
