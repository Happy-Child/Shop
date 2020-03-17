<template>
  <div class="admin__content">

    <div class="d-flex align-center justify-between">
      <h3 class="admin__content-title">Products</h3>

      <n-link :to="route('admin-products-create')" class="waves-effect waves-light btn">
        <i class="material-icons left">add</i>
        Create product
      </n-link>
    </div>

    <filters
      @startFilter="startFilter"
      :products_loading="products_loading"
      :categories_loading="categories_loading"
      :max-price="maxPrice"
      :categories="categories"
    />

    <p v-if="!pagesResult.length">No products</p>

    <template v-else>
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
  import { mapState } from 'vuex'
  import PaginationMixin from '../../../mixins/pagination'
  import FilterMixin from '../../../mixins/filter'
  import Filters from "../../../components/Filters";
  import getProdCatMixin from '../../../mixins/getProdCat'
  import ProductsList from "../../../components/ProductsList";

  export default {
    name: "Products",

    layout: 'admin',

    mixins: [PaginationMixin, FilterMixin, getProdCatMixin],

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

    computed: {
      ...mapState('products', [
        'products_loading',
      ]),

      ...mapState('categories', [
        'categories_loading',
      ])
    },

    components: {
      ProductsList,
      Filters,
    }
  }
</script>

<style scoped>

</style>
