<template>

  <div class="home">
    <h2>Home</h2>

    <filters
      @startFilter="startFilter"
      :products_loading="products_loading"
      :categories_loading="categories_loading"
      :max-price="maxPrice"
      :categories="categoriesFiltered"
    />

    <p v-if="!pagesResult.length">No products</p>

    <template>
      <products-list
        :products="pagesResult"
      />

      <vue-paginate
        v-if="pagesArray.length > 1"
        v-model="curPage"
        :page-count="pagesArray.length"
        :prev-text="'<'"
        :next-text="'>'"
        :click-handler="paginationHandler"
        :container-class="'pagination center'"
        :page-class="'waves-effect'"
      ></vue-paginate>
    </template>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import PaginationMixin from '../mixins/pagination'
  import FilterMixin from '../mixins/filter'
  import getProdCatMixin from '../mixins/getProdCat'
  import ProductsList from "../components/ProductsList";
  import Filters from "../components/Filters";

  export default {
    name: 'home',

    mixins: [PaginationMixin, FilterMixin, getProdCatMixin],

    data() {
      return {
        messages: {
          only_default_user: 'Login only for users of the site!',
          only_admin: 'Login for site administrators only!',
          auth: 'Login required!',
        }
      }
    },

    watch: {
      $route(route) {
        this.checkQuery(route);
      }
    },

    methods: {
      checkQuery(route) {
        const queryMessageKey = route.query.info;

        if(queryMessageKey && this.messages.hasOwnProperty(queryMessageKey)) {
          this.$noty.error(this.messages[queryMessageKey]);
        }
      }
    },

    computed: {
      ...mapState('products', [
        'products_loading',
      ]),

      ...mapState('categories', [
        'categories_loading',
      ]),

      categoriesFiltered() {
        const categoriesIdsCount = {};

        this.products.forEach((item) => {
          if(categoriesIdsCount.hasOwnProperty(item.category_id)) {
            categoriesIdsCount[item.category_id]++;
          } else {
            categoriesIdsCount[item.category_id] = 1;
          }
        });

        const filtered = this.categories.map(category => {
          return {
            ...category,
            productCount: categoriesIdsCount[category.id] || 0
          }
        });

        return filtered;
      }
    },

    mounted() {
      this.checkQuery(this.$route);
    },

    components: {
      ProductsList,
      Filters,
    }
  }
</script>


