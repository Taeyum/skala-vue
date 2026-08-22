<script setup>
import RollingNumber from '@/components/exercise/RollingNumber.vue'

defineProps({
  city: { type: Object, required: true },
  displayTemp: { type: [Number, String], default: null },
  unit: { type: String, default: '℃' },
  isSelected: { type: Boolean, default: false },
  night: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  canRemove: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'detail', 'toggle-favorite', 'remove'])

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`
</script>

<template>
  <div class="tile" :class="{ selected: isSelected }" @click="emit('select', city)">
    <div class="tile-top">
      <span class="name">
        {{ city.name }}
        <span v-if="night" class="night-mark" title="현지 시각 밤">🌙</span>
      </span>
      <div class="tile-actions">
        <button
          class="icon-btn"
          :class="{ active: isFavorite }"
          @click.stop="emit('toggle-favorite', city.id)"
        >
          {{ isFavorite ? '★' : '☆' }}
        </button>
        <button v-if="canRemove" class="icon-btn" @click.stop="emit('remove', city.id)">✕</button>
      </div>
    </div>

    <img v-if="city.icon" :src="iconUrl(city.icon)" alt="" class="tile-icon" />

    <div class="tile-temp">
      <RollingNumber :value="displayTemp" /><span class="unit">{{ unit }}</span>
    </div>

    <p class="tile-status">{{ city.status }}</p>

    <div class="tile-meta">
      <span>💧 <RollingNumber :value="city.humidity" />%</span>
      <span>🌬 <RollingNumber :value="city.windSpeed" />m/s</span>
    </div>

    <button class="btn-detail" @click.stop="emit('detail', city)">상세보기 →</button>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sp-5) var(--sp-4) var(--sp-4);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition:
    transform var(--dur-2) var(--ease-out),
    box-shadow var(--dur-2) var(--ease-out),
    border-color var(--dur-2) var(--ease-out);
}

.tile:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

/* 누르는 순간은 즉각(--dur-1) 가라앉고, 떼면 기본 속도로 느긋하게 복귀 */
.tile:active {
  transform: translateY(-2px) scale(0.98);
  box-shadow: var(--shadow-sm);
  transition-duration: var(--dur-1);
}

.tile.selected {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  transform: translateY(-2px);
}

.tile.selected:hover {
  transform: translateY(-6px);
}

.tile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.name {
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--c-text);
}

.night-mark {
  margin-left: 2px;
  font-size: 12px;
  vertical-align: 1px;
}

.tile-actions {
  display: flex;
  gap: var(--sp-1);
}

.icon-btn {
  padding: 2px 6px;
  border: none;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--c-text-muted);
  font-size: var(--fs-body);
  cursor: pointer;
  transition:
    color var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.icon-btn:hover {
  color: var(--c-text-sub);
}

.icon-btn:active {
  transform: scale(0.85);
  transition-duration: var(--dur-1);
}

.icon-btn.active {
  color: var(--c-accent);
}

.tile-icon {
  width: 72px;
  height: 72px;
  margin: var(--sp-1) 0;
}

.tile-temp {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  color: var(--c-text);
}

.unit {
  font-size: 18px;
  font-weight: 400;
  color: var(--c-text-sub);
}

.tile-status {
  margin: 6px 0 10px;
  font-size: var(--fs-sm);
  color: var(--c-text-sub);
}

.tile-meta {
  display: flex;
  gap: var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--c-text-sub);
}

.btn-detail {
  width: 100%;
  margin-top: 14px;
  padding: 7px;
  border: none;
  border-radius: var(--r-sm);
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-size: var(--fs-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur-2) var(--ease-out),
    transform var(--dur-2) var(--ease-out);
}

.btn-detail:hover {
  background: rgba(52, 152, 219, 0.2);
}

.btn-detail:active {
  transform: scale(0.96);
  transition-duration: var(--dur-1);
}
</style>
