<script setup>
defineProps({
  city: { type: Object, required: true },
  displayTemp: { type: [Number, String], default: null },
  unit: { type: String, default: '℃' },
  isSelected: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  canRemove: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'detail', 'toggle-favorite', 'remove'])

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`
</script>

<template>
  <div class="tile" :class="{ selected: isSelected }" @click="emit('select', city)">
    <div class="tile-top">
      <span class="name">{{ city.name }}</span>
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
      {{ displayTemp ?? '--' }}<span class="unit">{{ unit }}</span>
    </div>

    <p class="tile-status">{{ city.status }}</p>

    <div class="tile-meta">
      <span>💧 {{ city.humidity ?? '--' }}%</span>
      <span>🌬 {{ city.windSpeed ?? '--' }}m/s</span>
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
  padding: 20px 16px 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.tile:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.tile.selected {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.tile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.name {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
}

.tile-actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  padding: 2px 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #b2bec3;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: #636e72;
}

.icon-btn.active {
  color: #f7b731;
}

.tile-icon {
  width: 72px;
  height: 72px;
  margin: 4px 0;
}

.tile-temp {
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  color: #2c3e50;
}

.unit {
  font-size: 18px;
  font-weight: 400;
  color: #7f8c8d;
}

.tile-status {
  margin: 6px 0 10px;
  font-size: 13px;
  color: #7f8c8d;
}

.tile-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #95a5a6;
}

.btn-detail {
  width: 100%;
  margin-top: 14px;
  padding: 7px;
  border: none;
  border-radius: 8px;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-detail:hover {
  background: rgba(52, 152, 219, 0.2);
}
</style>