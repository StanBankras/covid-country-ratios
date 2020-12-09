<template>
  <div>
    <div class="input">
      <select v-model="countryInput">
        <option :value="country" v-for="country in countries" :key="country">{{ country }}</option>
      </select>
    </div>
    <div v-if="getDataForMultipleCountries" class="countries">
      <div v-for="country in getDataForMultipleCountries" :key="country.name" class="country">
        <p>{{ country.country }}</p>
        <div v-for="data in country.data" :key="data.name">
          <div class="top">
            <p>{{ data.name }}</p>
            <download-csv v-if="data.data.length > 0" class="download-button" :name="data.name + '.csv'" :data="data.data">
              Download this data
            </download-csv>
          </div>
          <div v-if="data.data.length > 0" class="table">
            <div class="row header" :style="'grid-template-columns: repeat(' + Object.keys(data.data[0]).length + ', 1fr)'">
              <div class="cell" v-for="key in Object.keys(data.data[0])" :key="key">
                {{ key }}
              </div>
            </div>
            <div class="row" v-for="obj in data.data" :style="'grid-template-columns: repeat(' + Object.keys(obj).length + ', 1fr)'" :key="obj.Date">
              <div class="cell" v-for="key in Object.keys(obj)" :key="key">
                {{ obj[key] }}
              </div>
            </div>
          </div>
          <p style="font-weight: normal;" v-else>No data for {{ country.country }} was found on this item</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import csv from 'csvtojson';

export default {
  computed: {
    getDataForMultipleCountries() {
      if(!this.data || !this.countryInput) return undefined;
      const countries = [this.countryInput];
      return countries.map(c => {
        return {
          country: c,
          data: this.getDataForCountry(c)
        }
      });
    },
    countries() {
      if(!this.data) return [];
      return [...new Set(this.data[0].json.map(x => x.Entity))];
    }
  },
  data() {
    return {
      csvFolder: 'http://localhost:8080/csv/',
      countryInput: 'Iceland',
      paths: [
        {
          name: 'Internal movement restrictions',
          path: 'internal-movement-covid.csv'
        },
        {
          name: 'International movement restrictions',
          path: 'international-travel-covid.csv'
        },
        {
          name: 'Public transport closures',
          path: 'public-transport-covid.csv'
        },
        {
          name: 'Transit hubs visitor change since start of pandemic',
          path: 'visitors-transit-covid.csv'
        },
        {
          name: 'Parks visitors change % since start pandemic',
          path: 'change-visitors-parks-covid.csv'
        },
        {
          name: 'Workplaces change % since start pandemic',
          path: 'workplace-visitors-covid.csv'
        },
        {
          name: 'Time spent at home change % since start pandemic',
          path: 'changes-residential-duration-covid.csv'
        }
      ],
      data: undefined
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async jsonFromCsv(path) {
      const data = await fetch(this.csvFolder + path).then(r => r.text());
      return csv()
        .fromString(data)
        .then(json => json);
    },
    getDataForCountry(country) {
      return this.data.map(p => {
        return {
          name: p.name,
          data: p.json.filter(d => d.Entity.toLowerCase() === country.toLowerCase())
        }
      });
    },
    loadData() {
      const data = this.paths.map(async (p) => {
        
        return {
          name: p.name,
          path: p.path,
          json: await this.jsonFromCsv(p.path)
        }
      });

      Promise.all(data).then(r => this.data = r);
    },
    selectCountry() {
      console.log(this.countryInput);
      this.countriesModel = [this.countryInput];
    }
  }
}
</script>

<style scoped>
.country {
  margin-bottom: 5rem;
}
.table {
  max-height: 400px;
  overflow-y: auto;
  border: 2px solid black;
  margin-bottom: 2rem;
}
.cell {
  padding: 0.3rem;
  border: 1px solid rgb(192, 192, 192);
}
.row.header {
  background-color: rgb(236, 236, 236);
  position: sticky;
  top: 0;
}
.row {
  display: grid;
}
.country > p, .country > div > p {
  font-weight: bold;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.top {
  font-weight: bold;
}
.download-button {
  font-size: 14px;
  background-color: rgb(214, 214, 214);
  padding: 0.5rem;
  cursor: pointer;
}
.input label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  padding: 0.5rem;
}
</style>