<script setup>
import WeatherBadge from './WeatherBadge.vue';
import TempGauge from './TempGauge.vue';

defineProps({
    city: {
        type: Object,
        required: true,
    },
    displayTemp: {
        type: [Number, String],
        default: null,
    },
    unit: {
        type: String,
        default: 'C',
    },
    gaugeWidth: {
        type: String,
        default: '0%',
    },
    isSelected: {
        type: Boolean,
        default: false,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: String,
        default: null,
    },
    canRemove: {
      type: Boolean,
      default: false,
    },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite', 'remove-card'])
</script>

<template>
    <div 
        class="weather-card"
        :class="{
            'is-hot': city.temp >= 25,
            'is-cool': city.temp !== null && city.temp < 25,
            'is-selected': isSelected
        }"
        @click="emit('select-card', city)"
    >
        <div class="card-title">
          <img v-if="icon" :src="`https://openweathermap.org/img/wn/${icon}@2x.png`" alt="" class="weather-icon" />
          <h4>{{ city.name }} ({{ city.status }})</h4>
        </div>
        <p>현재 기온: {{ displayTemp ?? '측정 불가' }}{{ city.temp === null ? '' : unit }}</p>

        <TempGauge v-if="city.temp !== null" :width="gaugeWidth" />
        <WeatherBadge :temp="city.temp" />
    
        <button class="btn-fav" :class="{ active: isFavorite }" @click.stop="emit('toggle-favorite', city.id)">
            {{ isFavorite ? '★' : '☆' }}
        </button>

        <button
          v-if="canRemove"
          class="btn-remove"
          @click.stop="emit('remove-card', city.id)"
          title="목록에서 제거"
        > ✕ </button>

        <button class="btn-detail" @click.stop="emit('click-detail', city)">상세보기</button>
    </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  color: #2c3e50;
}

.weather-card h4,
.weather-card p {
  color: #2c3e50;
}

.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}

.weather-card.is-hot {
  background: #fff5f4;
  border-color: #ffc9c2;
}

.weather-card.is-cool {
  background: #f4f9ff;
  border-color: #c2dcff;
}

.weather-card.is-selected {
  border-color: #42b883;
  border-width: 2px;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}

.btn-fav {
  position: absolute;
  right: 90px;
  top: 15px;
  padding: 4px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
}

.btn-fav.active {
  border-color: #f7b731;
  color: #f7b731;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-title h4 {
  margin: 0;
}

.weather-icon {
  width: 40px;
  height: 40px;
}
.btn-remove {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 2px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #fff;
  color: #868e96;
  font-size: 12px;
  cursor: pointer;
}

.btn-remove:hover {
  border-color: #ff7675;
  color: #ff7675;
}
</style>