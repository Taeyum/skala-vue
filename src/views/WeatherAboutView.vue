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
  gap: 16px;
}

.card {
  padding: 24px;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  background: #fff;
  color: #2c3e50;
}

.card h1 {
  margin: 0 0 8px;
  font-size: 26px;
  color: #2c3e50;
}

.card h2 {
  margin: 0 0 14px;
  font-size: 16px;
  color: #2c3e50;
}

.card p {
  margin: 0;
  color: #7f8c8d;
  line-height: 1.7;
}

.grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  padding: 10px 0;
  border-bottom: 1px solid #f1f3f5;
}

.list li:last-child {
  border-bottom: none;
}

.item-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.item-desc {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  color: #7f8c8d;
}

.note {
  margin-top: 14px !important;
  padding-top: 12px;
  border-top: 1px solid #f1f3f5;
  font-size: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tags li {
  padding: 6px 12px;
  border-radius: 20px;
  background: #f0f8ff;
  color: #3498db;
  font-size: 13px;
  font-weight: 600;
}

.links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.link-btn {
  padding: 10px 18px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.link-btn:hover {
  border-color: #3498db;
  color: #3498db;
  transform: translateY(-2px);
}
</style>