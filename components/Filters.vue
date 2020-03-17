<template>

  <section
    class="filters"
    :class="(products_loading || categories_loading) ? 'ban-overlay' : ''"
  >
    <form
      @submit.prevent="startFilter"
      class="row filters__form"
    >

      <div class="filter-item col s12 l4">
        <div class="input-field">
          <input
            v-model="formData.searchString"
            ref="name"
            id="last_name"
            placeholder="Search"
            type="text"
            class="validate"
          >
        </div>
      </div>

      <div class="filter-item col s6 l3">
        <select
          v-model="formData.categories"
          ref="category"
          multiple
        >
          <option
            v-if="!categories.length"
            value=""
            disabled
            selected
          >No categories</option>

          <option
            v-else
            value=""
            disabled
          >Choose category</option>

          <option
            v-if="category.productCount > 0"
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            :selected="s"
          >{{ category.name }} ({{ category.productCount }})</option>
        </select>
      </div>

      <div class="filter-item col s6 l3">
        <select v-model="formData.weight" ref="weight" multiple>
          <option value="" disabled selected>Choose weight</option>
          <option
            v-for="weight in weightList"
            :key="weight.value"
            :value="weight.value"
          >{{ weight.text }}</option>
        </select>
      </div>

      <div class="filter-item col s6 l2">
        <span class="label">Sort by</span>
        <select v-model="formData.sort" ref="sort">
          <option value="new" selected>New</option>
          <option value="price-desc">Price max-min</option>
          <option value="price-asc">Price min-max</option>
        </select>
      </div>

      <div class="filter-item col s6">
        <client-only placeholder="loading...">
          <vue-slider
            class="range-slider w-100"
            :tooltip="'always'"
            :interval="step"
            :adsorb="true"
            v-model="formData.price"
            :min="defaultPrice[0]"
            :max="defaultPrice[1]"
            :tooltip-formatter="formatter"
          />
        </client-only>

        <div class="wrap-inputs">
          <div class="input-field">
            <input v-model="formData.price[0]" placeholder="Min" type="number" class="validate">
          </div>

          <span class="del">-</span>

          <div class="input-field">
            <input v-model="formData.price[1]" placeholder="Max" type="number" class="validate">
          </div>
        </div>
      </div>

      <div class="filter-item filter-item_last col s6 l2">
        <span
          v-if="filteringWas"
          @click.prevent="resetFilter"
          :disabled="products_loading || categories_loading"
          class="waves-effect waves-light btn"
        >
          Reset
        </span>

        <button
          :disabled="products_loading || categories_loading"
          class="waves-effect center-box waves-light btn"
        >
          <loading v-if="products_loading || categories_loading"/>
          <span v-else>Search</span>
        </button>
      </div>

    </form>
  </section>

</template>

<script>
  let VueSlider;
  if (process.client) VueSlider = require('vue-slider-component');
  import 'vue-slider-component/theme/default.css'
  import FormMixins from "../mixins/form";

  export default {
    name: "Filters",

    mixins: [FormMixins],

    props: {
      products_loading: {
        type: Boolean
      },
      categories_loading: {
        type: Boolean
      },
      categories: {
        type: Array,
        default: []
      },
      maxPrice: {
        type: Number
      }
    },

    data() {
      return {
        formData: {
          searchString: '',
          categories: [],
          weight: [],
          sort: 'new',
          price: [0, this.maxPrice],
        },
        defaultPrice: [0, this.maxPrice],
        defaultSort: 'new',
        step: 1,
        formatter: '{value}$',
        categoryInstance: '',
        weightInstance: '',
        sortInstance: '',
        filteringWas: false,
        s: false
      }
    },

    watch: {
      'formData.weight'(s) {
        this.s = !this.s;
      }
    },

    methods: {
      initFormsItems() {
        this.categoryInstance = M.FormSelect.init(this.$refs.category, {});
        this.weightInstance = M.FormSelect.init(this.$refs.weight, {});
        this.sortInstance = M.FormSelect.init(this.$refs.sort, {});
      },

      destroyFormsItems() {
        if(this.categoryInstance.destroy) this.categoryInstance.destroy();
        if(this.weightInstance.destroy) this.weightInstance.destroy();
        if(this.sortInstance.destroy) this.sortInstance.destroy();
      },

      clearValues() {
        this.$refs.category.value = '';
        this.$refs.weight.value = '';
        this.$refs.sort.value = this.defaultSort;
      },

      fullFormReset() {
        this.formData = {
          searchString: '',
          categories: [],
          weight: [],
          sort: this.defaultSort,
          price: [this.defaultPrice[0], this.defaultPrice[1]],
        };
        this.clearValues();
        this.initFormsItems();
      },

      resetFilter() {
        this.fullFormReset();
        this.filteringWas = false;
        this.$emit('startFilter', {...this.formData});
      },

      startFilter() {
        this.filteringWas = true;
        this.$emit('startFilter', {...this.formData});
      }

    },

    computed: {
      weightList() {
        const maxValue = 20;
        let list = [];

        for(let item = 0; item <= maxValue; item++) {

          if(item !== maxValue) {
            list.push({
              text: `${item}kg - ${item + 1}kg`,
              value: `${item} - ${item + 1}`,
            });
          } else {
            list.push({
              text: `${item}kg +`,
              value: `${item}`,
            });
          }
        }

        return list;
      }
    },

    mounted() {
      setTimeout(() => {
        this.initFormsItems();
      }, 0);
    },

    beforeDestroy() {
      this.destroyFormsItems();
    },

    components: {
      VueSlider,
    }

  }
</script>

<style scoped>

  .filters {
    margin: .5rem 0 1rem;
  }

  .filters {
    position: relative;
  }

  .filters:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    cursor: not-allowed;
    opacity: 0;
    visibility: hidden;
    transition: .3s all ease;
    background-color: rgba(255, 255, 255, .9);
  }

  .filters.ban-overlay:after {
    opacity: 1;
    visibility: visible;
  }

  .filter-item {
    display: flex;
    align-items: center;
  }

  .filter-item .input-field {
    flex: 1 1 auto;
  }

  .filter-item .label {
    flex-shrink: 0;
    margin-right: 1rem;
  }

  .filters > .row > * {
    margin-bottom: 1rem;
  }

  .filter-item_last button {
    margin: 0 0 0 auto;
  }

  .filter-item_last {
    float: right;
  }

  .filters .input-field {
    margin: 0;
  }

  .wrap-inputs {
    display: flex;
    flex-shrink: 0;
    margin-left: 2rem;
    max-width: 220px;
    align-items: center;
  }

  .del {
    margin: 0 .5rem;
  }

</style>


