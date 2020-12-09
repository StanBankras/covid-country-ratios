<template>
  <div>
    <p>Calculation = covid cases / total population * 100</p>
    <p>Source: <a href="https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json">Our World in Data</a></p>
    <p>Select population</p>
    <vue-range-slider ref="slider" v-model="population" :min="0" :max="30 * 1000 * 1000"></vue-range-slider>
    <div class="continent-wrapper" v-if="continentExtremes">
      <div class="continents" v-for="continent in Object.keys(continentExtremes)" :key="continent">
        <h3>{{ continent }}</h3>
        <p>Best: {{ continentExtremes[continent].best.country }}: <strong>{{ continentExtremes[continent].best.casePercent }}</strong></p>
        <p>Worst: {{ continentExtremes[continent].worst.country }}: <strong>{{ continentExtremes[continent].worst.casePercent }}</strong></p>
        <p>{{ data.filter(x => x.population > population && x.continent === continent).length }} / {{ data.filter(x => x.continent === continent).length }} countries with population > {{ population }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-range-component/dist/vue-range-slider.css'
import VueRangeSlider from 'vue-range-component'

export default {
  components: {
    VueRangeSlider
  },
  computed: {
    dataPerContinent() {
      if(!this.continents) return [];
      return this.continents.map(c => {
        const continent = c;
        if(!continent) return;

        const results = this.data.filter(r => r.continent === continent).filter(r => r.population > this.population);
        return results.sort((a, b) => b.caseRatio - a.caseRatio);
      });
    },
    continentExtremes() {
      if(this.dataPerContinent.length === 0) return undefined;

      const continentExtremes = {};

      this.dataPerContinent.forEach(d => {
        if(!d || !d[0]) return;
        if(isNaN(d[0].caseRatio)) {
          d[0].caseRatio = 0;
          return console.log(d[0]);
        }
        if(isNaN(d[d.length-1].caseRatio)) {
          console.log(d);
          d[d.length-1].caseRatio = 0;
        } 

        return continentExtremes[d[0].continent] = {
          best: { country: d[d.length-1].country, casePercent: d[d.length-1].caseRatio * 100 + '%' },
          worst: { country: d[0].country, casePercent: d[0].caseRatio * 100 + '%' }
        }
      });

      return continentExtremes;
    }
  },
  data() {
    return {
      continents: undefined,
      data: undefined,
      population: 5000000
    }
  },
  mounted() {
    fetch('https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json').then(res => res.json()).then(data => {
      this.data = Object.keys(data).map(countryCode => {
        const cases = countryCode === 'HKG' ? 7076 : data[countryCode].data.reduce((acc, curr) => curr.new_cases ? acc + curr.new_cases : acc, 0);
        return {
          cases,
          caseRatio: cases / data[countryCode].population,
          country: data[countryCode].location,
          continent: data[countryCode].continent,
          population: data[countryCode].population
        }
      });

      // console.log(this.data['USA']);

      this.continents = [...new Set(this.data.map(r => r.continent))];
    });
  }
}
</script>