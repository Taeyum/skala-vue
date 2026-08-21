<script setup>
import { RouterLink } from 'vue-router'

const APIS = [
  { name: 'OpenWeatherMap — Current Weather', desc: '도시별 실시간 날씨와 아이콘' },
  { name: 'OpenWeatherMap — 5 Day Forecast', desc: '3시간 간격 시간별 예보 차트' },
  { name: 'OpenWeatherMap — Air Pollution', desc: '대기질 지수와 미세먼지 농도' },
  { name: 'OpenWeatherMap — Geocoding', desc: '사용자 도시 추가 시 좌표 조회' },
  { name: 'Pexels — Photo Search', desc: '날씨 상태에 맞는 배경 이미지' },
]

const STACK = [
  'Vue 3 (Composition API)',
  'Vue Router — 지연 로딩, Catch-all',
  'Pinia — 6개 전역 스토어',
  'Axios — REST API 통신',
  'Element Plus — UI 라이브러리 실습',
  'Vite',
]
</script>

<template>
  <div class="about">
    <section class="card intro">
      <h1>🌤️ Weather Dashboard</h1>
      <p>
        SK AX Full-stack Engineering 3 — Frontend Framework 과정에서 단계별로 만들어 온
        기상 관측 대시보드입니다. 강의 단원마다 배운 문법을 하나씩 얹어 확장했습니다.
      </p>
    </section>

    <div class="grid">
      <section class="card">
        <h2>사용한 API</h2>
        <ul class="list">
          <li v-for="api in APIS" :key="api.name">
            <span class="item-name">{{ api.name }}</span>
            <span class="item-desc">{{ api.desc }}</span>
          </li>
        </ul>
        <p class="note">
          Pexels 가이드라인에 따라 상세 페이지에 사진작가 크레딧과 원본 링크를 표기합니다.
        </p>
      </section>

      <section class="card">
        <h2>기술 스택</h2>
        <ul class="tags">
          <li v-for="s in STACK" :key="s">{{ s }}</li>
        </ul>
      </section>
    </div>

    <section class="card">
      <h2>바로가기</h2>
      <div class="links">
        <RouterLink to="/" class="link-btn">🌤️ 대시보드</RouterLink>
        <RouterLink to="/practice" class="link-btn">📚 실습 모음</RouterLink>
        <RouterLink to="/mockup" class="link-btn">📝 과제 1·2 (Mockup)</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.card {
  padding: var(--sp-6);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
  color: var(--c-text);
}

.card h1 {
  margin: 0 0 var(--sp-2);
  font-size: var(--fs-h1);
  font-weight: 700;
  color: var(--c-text);
}

.card h2 {
  margin: 0 0 14px;
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--c-text);
}

.card p {
  margin: 0;
  color: var(--c-text-sub);
  font-size: var(--fs-body);
  line-height: 1.7;
}

.grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--sp-4);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  padding: 10px 0;
  border-bottom: 1px solid var(--c-divider);
}

.list li:last-child {
  border-bottom: none;
}

.item-name {
  display: block;
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--c-text);
}

.item-desc {
  display: block;
  margin-top: 2px;
  font-size: var(--fs-sm);
  color: var(--c-text-sub);
}

.card .note {
  margin-top: 14px;
  padding-top: var(--sp-3);
  border-top: 1px solid var(--c-divider);
  font-size: var(--fs-xs);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 6px var(--sp-3);
  border-radius: var(--r-pill);
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-size: var(--fs-sm);
  font-weight: 600;
}

.links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.link-btn {
  padding: 10px 18px;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  background: #fff;
  color: var(--c-text);
  text-decoration: none;
  font-size: var(--fs-body);
  font-weight: 600;
  transition: all 0.2s;
}

.link-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
  transform: translateY(-2px);
}
</style>
