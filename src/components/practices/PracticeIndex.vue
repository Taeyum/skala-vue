<script setup>
import SampleOne from './basic/SampleOne.vue'
import SampleTwo from './basic/SampleTwo.vue'
import VueHtml from './basic/VueHtml.vue'
import VueHtmlXss from './basic/VueHtmlXss.vue'
import VueText from './basic/VueText.vue'
import VueBind from './basic/VueBind.vue'
import VueBindClass from './basic/VueBindClass.vue'
import VueBindShorthand from './basic/VueBindShorthand.vue'
import VueBindStyle from './basic/VueBindStyle.vue'
import VueIf from './basic/VueIf.vue'
import VueShow from './basic/VueShow.vue'
import VueFor from './basic/VueFor.vue'
import VuePre from './basic/VuePre.vue'
import VueCloak from './basic/VueCloak.vue'
import VueOnce from './basic/VueOnce.vue'
import VueMemo from './basic/VueMemo.vue'
import EventHandlerBasic from './basic/EventHandlerBasic.vue'
import EventHandlerObject from './basic/EventHandlerObject.vue'
import EventHandlerModifier from './basic/EventHandlerModifier.vue'
import ModelBasic from './basic/ModelBasic.vue'
import ModelForm from './basic/ModelForm.vue'
import ModelModifier from './basic/ModelModifier.vue'
import StyleScoped from './basic/StyleScoped.vue'
import ReactiveRef from './composition/ReactiveRef.vue'
import ReactiveReactive from './composition/ReactiveReactive.vue'
</script>

<template>
  <div class="practice-index">
    <h2>Vue Syntax 실습 모음</h2>

    <h3 class="group">1. 기초 — 반응성 / 텍스트 보간</h3>
    <SampleOne />
    <hr />
    <SampleTwo />

    <h3 class="group">2. 디렉티브</h3>
    <VueHtml />
    <hr />
    <VueHtmlXss />
    <hr />
    <VueText />
    <hr />
    <VueBind />
    <hr />
    <VueBindClass />
    <hr />
    <VueBindShorthand />
    <hr />
    <VueBindStyle />
    <hr />
    <VueIf />
    <hr />
    <VueShow />
    <hr />
    <VueFor />
    <hr />
    <VuePre />
    <hr />
    <VueCloak />
    <hr />
    <VueOnce />
    <hr />
    <VueMemo />

    <h3 class="group">3. 이벤트 핸들링</h3>
    <EventHandlerBasic />
    <hr />
    <EventHandlerObject />
    <hr />
    <EventHandlerModifier />

    <h3 class="group">4. 폼 바인딩</h3>
    <ModelBasic />
    <hr />
    <ModelForm />
    <hr />
    <ModelModifier />

    <h3 class="group">5. 스타일</h3>
    <StyleScoped />

    <h3 class="group">6. Composition API</h3>
    <ReactiveRef />
    <hr />
    <ReactiveReactive />
  </div>
</template>

<style scoped>
.group {
  margin-top: 40px;
  padding: 8px 12px;
  border-left: 5px solid #42b883;
  /* background-color 제거 */
}
</style>
