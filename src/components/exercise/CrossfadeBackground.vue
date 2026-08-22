<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // 'linear-gradient(...)' 또는 'url(...)' 문자열
  background: { type: String, default: '' },
})

const layers = ref([])
let uid = 0

const push = (bg) => {
  const id = ++uid
  layers.value.push({ id, bg, on: false })
  // transitionend가 유실돼도 레이어가 무한 누적되지 않도록 상한을 둔다
  if (layers.value.length > 3) layers.value.splice(0, layers.value.length - 2)
  // 첫 프레임에 opacity 0으로 그려진 뒤에 켜야 전환이 걸린다
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const layer = layers.value.find((l) => l.id === id)
      if (layer) layer.on = true
    }),
  )
}

watch(
  () => props.background,
  (bg) => {
    if (!bg || bg === layers.value.at(-1)?.bg) return
    const url = /url\((['"]?)(.*?)\1\)/.exec(bg)?.[2]
    if (url) {
      // 로딩이 안 끝난 이미지가 페이드인하면 빈 레이어가 번쩍인다 — 받아 놓고 시작
      const img = new Image()
      img.onload = img.onerror = () => push(bg)
      img.src = url
    } else {
      push(bg)
    }
  },
  { immediate: true },
)

// 맨 위 레이어가 다 나타나면 아래 레이어들은 안 보이므로 제거
const prune = (layer) => {
  const idx = layers.value.indexOf(layer)
  if (idx > 0) layers.value.splice(0, idx)
}
</script>

<template>
  <div class="xfade" aria-hidden="true">
    <div
      v-for="l in layers"
      :key="l.id"
      class="xfade-layer"
      :class="{ on: l.on }"
      :style="{ backgroundImage: l.bg }"
      @transitionend="prune(l)"
    ></div>
  </div>
</template>

<style scoped>
.xfade {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  overflow: hidden;
}

.xfade-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity var(--dur-4) var(--ease-in-out);
}

.xfade-layer.on {
  opacity: 1;
}
</style>
