<script setup>
import { ref, computed } from 'vue'

// Ch3 기초
import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'
// Ch3 디렉티브
import VueHtml from '@/components/practices/basic/VueHtml.vue'
import VueHtmlXss from '@/components/practices/basic/VueHtmlXss.vue'
import VueText from '@/components/practices/basic/VueText.vue'
import VueBind from '@/components/practices/basic/VueBind.vue'
import VueBindClass from '@/components/practices/basic/VueBindClass.vue'
import VueBindShorthand from '@/components/practices/basic/VueBindShorthand.vue'
import VueBindStyle from '@/components/practices/basic/VueBindStyle.vue'
import VueIf from '@/components/practices/basic/VueIf.vue'
import VueShow from '@/components/practices/basic/VueShow.vue'
import VueFor from '@/components/practices/basic/VueFor.vue'
import VuePre from '@/components/practices/basic/VuePre.vue'
import VueCloak from '@/components/practices/basic/VueCloak.vue'
import VueOnce from '@/components/practices/basic/VueOnce.vue'
import VueMemo from '@/components/practices/basic/VueMemo.vue'
// Ch3 이벤트 · 폼 · 스타일
import EventHandlerBasic from '@/components/practices/basic/EventHandlerBasic.vue'
import EventHandlerObject from '@/components/practices/basic/EventHandlerObject.vue'
import EventHandlerModifier from '@/components/practices/basic/EventHandlerModifier.vue'
import ModelBasic from '@/components/practices/basic/ModelBasic.vue'
import ModelForm from '@/components/practices/basic/ModelForm.vue'
import ModelModifier from '@/components/practices/basic/ModelModifier.vue'
import StyleScoped from '@/components/practices/basic/StyleScoped.vue'
// Ch7 · Ch8 · Ch9
import StoreCounter from '@/components/practices/library/StoreCounter.vue'
import AxiosWeather from '@/components/practices/library/AxiosWeather.vue'
import AxiosJson from '@/components/practices/library/AxiosJson.vue'
import ElementForm from '@/components/practices/library/ElementForm.vue'
import ElementProduct from '@/components/practices/library/ElementProduct.vue'
import ElementFeedback from '@/components/practices/library/ElementFeedback.vue'

const CHAPTERS = [
  {
    key: 'ch3-basic',
    chapter: 'Ch.3',
    title: 'Vue 기초',
    desc: '반응형 데이터와 텍스트 보간',
    items: [
      { name: '반응성 데이터 (ref)', page: 'p.70', comp: SampleOne },
      { name: '텍스트 보간 표현식', page: 'p.71', comp: SampleTwo },
    ],
  },
  {
    key: 'ch3-directive',
    chapter: 'Ch.3',
    title: 'Vue 디렉티브',
    desc: 'v-html / v-bind / v-if / v-for 등',
    items: [
      { name: 'v-html', page: 'p.74', comp: VueHtml },
      { name: 'v-html XSS', page: 'p.75', comp: VueHtmlXss },
      { name: 'v-text', page: 'p.76', comp: VueText },
      { name: 'v-bind 기본', page: 'p.77', comp: VueBind },
      { name: 'v-bind Class', page: 'p.79', comp: VueBindClass },
      { name: 'v-bind Style', page: 'p.81', comp: VueBindStyle },
      { name: 'v-bind 단축 문법', page: 'p.83', comp: VueBindShorthand },
      { name: 'v-if / v-else', page: 'p.84', comp: VueIf },
      { name: 'v-show', page: 'p.85', comp: VueShow },
      { name: 'v-for', page: 'p.88', comp: VueFor },
      { name: 'v-pre', page: 'p.89', comp: VuePre },
      { name: 'v-cloak', page: 'p.90', comp: VueCloak },
      { name: 'v-once', page: 'p.91', comp: VueOnce },
      { name: 'v-memo', page: 'p.92', comp: VueMemo },
    ],
  },
  {
    key: 'ch3-event',
    chapter: 'Ch.3',
    title: 'Vue 이벤트,폼,스타일',
    desc: 'v-on / v-model / scoped style',
    items: [
      { name: '이벤트 핸들러', page: 'p.96', comp: EventHandlerBasic },
      { name: '이벤트 객체', page: 'p.100', comp: EventHandlerObject },
      { name: '이벤트 수식어', page: 'p.102', comp: EventHandlerModifier },
      { name: 'v-model 기본', page: 'p.106', comp: ModelBasic },
      { name: 'v-model Form 요소', page: 'p.108', comp: ModelForm },
      { name: 'v-model 수식어', page: 'p.111', comp: ModelModifier },
      { name: 'Scoped Style', page: 'p.114', comp: StyleScoped },
    ],
  },
  {
    key: 'ch7',
    chapter: 'Ch.7',
    title: 'Pinia',
    desc: 'state / getters / actions',
    items: [{ name: 'Counter Store', page: 'p.204', comp: StoreCounter }],
  },
  {
    key: 'ch8',
    chapter: 'Ch.8',
    title: 'Axios',
    desc: 'REST API 통신',
    items: [
      { name: 'OpenWeather 호출', page: 'p.224', comp: AxiosWeather },
      { name: 'JSONPlaceholder CRUD', page: 'p.228', comp: AxiosJson },
    ],
  },
  {
    key: 'ch9',
    chapter: 'Ch.9',
    title: 'Element Plus',
    desc: 'UI 라이브러리 컴포넌트',
    items: [
      { name: 'Form 검증', page: 'p.246', comp: ElementForm },
      { name: 'Data Input', page: 'p.247', comp: ElementProduct },
      { name: 'Feedback', page: 'p.248', comp: ElementFeedback },
    ],
  },
]

const activeKey = ref(CHAPTERS[0].key)
const activeChapter = computed(() => CHAPTERS.find((c) => c.key === activeKey.value))

// 현재 챕터에서 펼쳐진 실습 (아코디언)
const openItem = ref(null)

const toggleItem = (name) => {
  openItem.value = openItem.value === name ? null : name
}

const selectChapter = (key) => {
  activeKey.value = key
  openItem.value = null
}
</script>

<template>
  <div class="practice-page">
    <header class="page-head">
      <h1>실습 모음</h1>
      <p>강의 단원별 Code Challenge 실습 컴포넌트입니다. 항목을 눌러 펼쳐 보세요.</p>
    </header>

    <div class="layout">
      <!-- 좌측: 챕터 목록 -->
      <aside class="side">
        <button
          v-for="ch in CHAPTERS"
          :key="ch.key"
          class="side-item"
          :class="{ active: activeKey === ch.key }"
          @click="selectChapter(ch.key)"
        >
          <span class="side-chapter">{{ ch.chapter }}</span>
          <span class="side-title">{{ ch.title }}</span>
          <span class="side-count">{{ ch.items.length }}</span>
        </button>
      </aside>

      <!-- 우측: 실습 아코디언 -->
      <section class="content">
        <div class="content-head">
          <h2>{{ activeChapter.title }}</h2>
          <p>{{ activeChapter.desc }}</p>
        </div>

        <div
          v-for="item in activeChapter.items"
          :key="item.name"
          class="accordion"
          :class="{ open: openItem === item.name }"
        >
          <button class="accordion-head" @click="toggleItem(item.name)">
            <span class="acc-name">{{ item.name }}</span>
            <span class="acc-page">{{ item.page }}</span>
            <span class="acc-arrow">▾</span>
          </button>

          <Transition name="acc">
            <div v-if="openItem === item.name" class="accordion-body">
              <component :is="item.comp" />
            </div>
          </Transition>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.practice-page {
  color: var(--c-text);
}

/* ── 페이지 헤더 ── */
.page-head {
  margin-bottom: var(--sp-4);
  padding: var(--sp-6);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
  color: var(--c-text);
}

.page-head h1 {
  margin: 0 0 var(--sp-1);
  font-size: var(--fs-h1);
  font-weight: 700;
  color: var(--c-text);
}

.page-head p {
  margin: 0;
  color: var(--c-text-sub);
  font-size: var(--fs-sm);
}

.layout {
  display: flex;
  gap: var(--sp-4);
  align-items: flex-start;
}

/* ── 좌측 챕터 ── */
.side {
  flex: 0 0 230px;
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.side-item {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) 14px;
  border: 1px solid var(--surface-border);
  border-left: 3px solid transparent;
  border-radius: var(--r-md);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-sm);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.side-item:hover {
  border-color: #d0e4f5;
  border-left-color: #b8d8f0;
}

.side-item.active {
  border-color: var(--c-primary);
  border-left-color: var(--c-primary);
  background: #fff;
}

.side-chapter {
  flex: 0 0 34px;
  font-size: var(--fs-xs);
  font-weight: 700;
  color: var(--c-primary);
}

.side-title {
  flex: 1;
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: 1.35;
  color: var(--c-text);
}

.side-count {
  flex: 0 0 auto;
  min-width: 20px;
  padding: 2px 7px;
  border-radius: var(--r-pill);
  background: var(--c-divider);
  font-size: var(--fs-xs);
  text-align: center;
  color: var(--c-text-sub);
}

.side-item.active .side-count {
  background: var(--c-primary);
  color: #fff;
}

/* ── 우측 내용 ── */
.content {
  flex: 1;
  min-width: 0;
  padding: var(--sp-6);
  border: 1px solid var(--surface-border);
  border-radius: var(--r-lg);
  background: var(--surface);
  backdrop-filter: var(--surface-blur);
  -webkit-backdrop-filter: var(--surface-blur);
  box-shadow: var(--shadow-md);
  color: var(--c-text);
}

.content-head {
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--c-divider);
}

.content-head h2 {
  margin: 0 0 2px;
  font-size: var(--fs-h2);
  font-weight: 700;
  color: var(--c-text);
}

.content-head p {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--c-text-sub);
}

/* ── 아코디언 ── */
.accordion {
  margin-bottom: 6px;
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s;
}

.accordion:hover {
  border-color: #d0e4f5;
}

.accordion.open {
  border-color: var(--c-primary);
}

.accordion-head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: var(--sp-3) var(--sp-4);
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.acc-name {
  flex: 1;
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--c-text);
}

.acc-page {
  padding: 2px var(--sp-2);
  border-radius: var(--r-sm);
  background: var(--c-divider);
  font-size: var(--fs-xs);
  color: var(--c-text-sub);
}

.acc-arrow {
  width: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--c-primary);
  transition: transform 0.25s;
}

.accordion.open .acc-arrow {
  transform: rotate(180deg);
}

.accordion-body {
  padding: var(--sp-2) var(--sp-4) var(--sp-4);
  border-top: 1px solid var(--c-divider);
}

/* 실습 컴포넌트 내부 글자색 보정 */
.accordion-body :deep(h2),
.accordion-body :deep(h3),
.accordion-body :deep(h4),
.accordion-body :deep(p),
.accordion-body :deep(li),
.accordion-body :deep(label),
.accordion-body :deep(span) {
  color: var(--c-text);
}

.accordion-body :deep(h2) {
  font-size: var(--fs-h2);
}

.accordion-body :deep(h3) {
  font-size: var(--fs-body);
}

/* 아코디언 펼침 애니메이션 */
.acc-enter-active,
.acc-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.acc-enter-from,
.acc-leave-to {
  opacity: 0;
  max-height: 0;
}

.acc-enter-to,
.acc-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
