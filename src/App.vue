<script setup>
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import VueHtml from './components/practices/basic/VueHtml.vue'
import VueHtmlXss from './components/practices/basic/VueHtmlXss.vue'
import VueText from './components/practices/basic/VueText.vue'
import VueBind from './components/practices/basic/VueBind.vue'
import VueBindClass from './components/practices/basic/VueBindClass.vue'
import VueBindShorthand from './components/practices/basic/VueBindShorthand.vue'
import VueBindStyle from './components/practices/basic/VueBindStyle.vue'
import VueIf from './components/practices/basic/VueIf.vue'
import VueShow from './components/practices/basic/VueShow.vue'
import VueFor from './components/practices/basic/VueFor.vue'
import VuePre from './components/practices/basic/VuePre.vue'
import VueCloak from './components/practices/basic/VueCloak.vue'
import VueOnce from './components/practices/basic/VueOnce.vue'
import VueMemo from './components/practices/basic/VueMemo.vue'
import EventHandlerBasic from './components/practices/basic/EventHandlerBasic.vue'
import EventHandlerObject from './components/practices/basic/EventHandlerObject.vue'
import EventHandlerModifier from './components/practices/basic/EventHandlerModifier.vue'
import ModelBasic from './components/practices/basic/ModelBasic.vue'
import ModelForm from './components/practices/basic/ModelForm.vue'
import ModelModifier from './components/practices/basic/ModelModifier.vue'
import StyleScoped from './components/practices/basic/StyleScoped.vue'
</script>

<template>
  <h1>Hello Skala-Vue</h1>
  <SampleOne />
  <hr />
  <SampleTwo />
  <hr />
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
  <hr />
  <EventHandlerBasic />
  <hr />
  <EventHandlerObject />
  <hr />
  <EventHandlerModifier />
  <hr />
  <ModelBasic />
  <hr />
  <ModelForm />
  <hr />
  <ModelModifier />
  <hr />
  <StyleScoped/>
</template>


<style>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

</style>
