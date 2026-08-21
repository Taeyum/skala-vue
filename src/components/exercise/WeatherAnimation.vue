<script setup>
import { computed } from 'vue'

const props = defineProps({
  // OpenWeather weather[0].main
  main: { type: String, default: null },
})

// 각 입자의 랜덤 위치·속도를 미리 계산 (렌더링마다 흔들리지 않도록 computed)
const drops = computed(() =>
  Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5,
    height: 40 + Math.random() * 40,
  })),
)

const flakes = computed(() =>
  Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 6,
    size: 4 + Math.random() * 6,
    drift: -30 + Math.random() * 60,
  })),
)

const clouds = computed(() =>
  Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top: 5 + Math.random() * 50,
    delay: Math.random() * 20,
    duration: 40 + Math.random() * 40,
    scale: 0.6 + Math.random() * 0.8,
  })),
)

const type = computed(() => {
  const m = props.main
  if (m === 'Rain' || m === 'Drizzle' || m === 'Thunderstorm') return 'rain'
  if (m === 'Snow') return 'snow'
  if (m === 'Clear') return 'clear'
  if (m === 'Clouds' || m === 'Mist' || m === 'Fog' || m === 'Haze') return 'clouds'
  return 'none'
})
</script>

<template>
  <div class="anim-layer" aria-hidden="true">
    <!-- 비 -->
    <template v-if="type === 'rain'">
      <span
        v-for="d in drops"
        :key="d.id"
        class="drop"
        :style="{
          left: d.left + '%',
          height: d.height + 'px',
          animationDelay: d.delay + 's',
          animationDuration: d.duration + 's',
        }"
      />
    </template>

    <!-- 눈 -->
    <template v-else-if="type === 'snow'">
      <span
        v-for="f in flakes"
        :key="f.id"
        class="flake"
        :style="{
          left: f.left + '%',
          width: f.size + 'px',
          height: f.size + 'px',
          animationDelay: f.delay + 's',
          animationDuration: f.duration + 's',
          '--drift': f.drift + 'px',
        }"
      />
    </template>

    <!-- 맑음: 태양 광선 -->
    <div v-else-if="type === 'clear'" class="sun">
      <span class="sun-core" />
      <span class="sun-ray" />
    </div>

    <!-- 구름 -->
    <template v-else-if="type === 'clouds'">
      <span
        v-for="c in clouds"
        :key="c.id"
        class="cloud"
        :style="{
          top: c.top + '%',
          animationDelay: '-' + c.delay + 's',
          animationDuration: c.duration + 's',
          transform: `scale(${c.scale})`,
        }"
      />
    </template>
  </div>
</template>

<style scoped>
.anim-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: inherit;
}

/* ── 비 ── */
.drop {
  position: absolute;
  top: -80px;
  width: 1.5px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5));
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fall {
  to {
    transform: translateY(110vh);
  }
}

/* ── 눈 ── */
.flake {
  position: absolute;
  top: -20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  animation-name: snowfall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes snowfall {
  to {
    transform: translate(var(--drift), 110vh);
  }
}

/* ── 맑음 ── */
.sun {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 260px;
  height: 260px;
}

.sun-core {
  position: absolute;
  inset: 70px;
  border-radius: 50%;
  background: rgba(255, 235, 150, 0.35);
  filter: blur(10px);
  animation: pulse 4s ease-in-out infinite;
}

.sun-ray {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 240, 170, 0.3) 0%, rgba(255, 240, 170, 0) 65%);
  animation: spin 30s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── 구름 ── */
.cloud {
  position: absolute;
  left: -200px;
  width: 160px;
  height: 50px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.16);
  filter: blur(6px);
  animation-name: drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes drift {
  to {
    transform: translateX(calc(100vw + 400px));
  }
}
</style>