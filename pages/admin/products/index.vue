<template>
  <div class="admin__content">

    <div class="d-flex align-center justify-between">
      <h3 class="admin__content-title">Products</h3>

      <n-link :to="route('admin-products-create')" class="waves-effect waves-light btn">
        <i class="material-icons left">add</i>
        Create product
      </n-link>
    </div>

    <div v-if="products_loading || categories_loading" class="center-box">
      <loading />
    </div>

    <p v-else-if="!pagesResult.length">No products</p>

    <template v-else>
      <filters />

      <products-list
        :products="pagesResult"
        :xlCount="3"
        :btnLink="{link: 'admin-products-id', text: 'Change'}"
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
  import { mapActions, mapState } from 'vuex'
  import PaginationMixin from '../../../mixins/pagination'
  import Filters from "../../../components/site/pages/home/Filters";
  import ProductsList from "../../../components/ProductsList";

  export default {
    name: "Products",

    layout: 'admin',

    mixins: [PaginationMixin],

    data() {
      return {
        itemsPerPage: 9,
      }
    },

    watch: {
      products: {
        handler(products) {
          if(products.length) {
            this.splitPages([...products]);
          }
        },
        deep: true,
        immediate: true
      }
    },

    methods: {
      ...mapActions('products', [
        'getProducts',
      ]),

      ...mapActions('categories', [
        'getCategories'
      ]),
    },

    computed: {
      ...mapState('products', [
        'products',
        'products_loading',
      ]),

      ...mapState('categories', [
        'categories',
        'categories_loading',
      ])
    },

    mounted() {
      if(!this.products.length) {
        try {
          this.getProducts();
        }
        catch(error) {
          this.$noty.error(error.message);
        }
      }

      if(!this.categories.length) {
        try {
          this.getCategories();
        }
        catch(error) {
          this.$noty.error(error.message);
        }
      }
    },

    components: {
      ProductsList,
      Filters,
    }
  }
</script>

<style scoped>

</style>
