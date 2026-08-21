<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="about-box">
        <h3>서비스 소개</h3>

        <p>본 앱은 Vue 3 및 Vue Router 기반으로 제작한 실습용 기상 관측 대시보드입니다.</p>
        
        <ul>
            <li><code>components/exercise/</code>폴더 내부의 독립 부품 컴포넌트 연동</li>
            <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
            <li>라우터 지연 로딩(Lazy Loading)과 Catch-all Route 적용</li>
        </ul>

        <RouterLink to="/" class="btn-primary">대시보드 홈으로 이동</RouterLink>

        <hr />

        <h4>이전 과제 및 실습</h4>
        <ul class="link-list">
            <li><RouterLink to="/mockup">과제 1,2 - Weather Mockup</RouterLink></li>
            <li><RouterLink to="/practice">Vue Syntax 실습 모음</RouterLink></li>
        </ul>
    </div>
</template>

<style scoped>
.about-box {
  padding: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #2c3e50;
}

.about-box h3,
.about-box h4,
.about-box p,
.about-box li {
  color: #2c3e50;
}

.about-box code {
  padding: 2px 6px;
  border-radius: 3px;
  background: #fff3bf;
  color: #e67700;
  font-size: 13px;
}

.btn-primary {
  display: block;
  margin-top: 16px;
  padding: 10px;
  border-radius: 4px;
  background: #3498db;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}

.link-list a {
  color: #3498db;
}
</style>