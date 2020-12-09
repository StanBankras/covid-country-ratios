<template>
  <div id="app">
    <div class="nav">
      <button @click="selected = 'extremes'">Covid extremes</button>
      <button @click="selected = 'related'">Covid related data per country</button>
    </div>
    <covid-extremes v-show="selected === 'extremes'"/>
    <covid-related v-show="selected === 'related'"/>
  </div>
</template>

<script>
import CovidExtremes from '@/components/CovidExtremes';
import CovidRelated from '@/components/CovidRelated';

export default {
  components: { CovidExtremes, CovidRelated },
  data() {
    return {
      selected: 'related'
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 60px;
  margin-right: 60px;
}
.continent-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 800px;
}
.nav {
  margin-bottom: 1rem;
}
</style>
