<template>
  <div class="admin__content">

    <div class="d-flex align-center justify-between">
      <h3 class="admin__content-title">Brand</h3>

      <n-link :to="route('admin-brands-create')" class="waves-effect waves-light btn">
        <i class="material-icons left">add</i>
        Create brand
      </n-link>
    </div>

    <div v-if="categories_loading || products_loading" class="center-box">
      <loading />
    </div>

    <p v-else-if="!pagesResult.length">No categories</p>

    <template v-else>
      <brands-table
        :categories="pagesResult"
        :products="products"
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
  import getProdCatMixin from '../../../mixins/getProdCat'
  import BrandsTable from "../../../components/admin/pages/brands/BrandsTable";

  export default {
    name: "Brands",

    layout: 'admin',

    mixins: [PaginationMixin, getProdCatMixin],

    watch: {
      categories: {
        handler(categories) {
          if(categories.length) {
            this.splitPages([...categories]);
          }
        },
        deep: true,
        immediate: true
      }
    },

    computed: {
      ...mapState('categories', [
        'categories_loading',
      ]),

      ...mapState('products', [
        'products_loading',
      ])
    },

    components: {
      BrandsTable
    }
  }
</script>

<style scoped>

</style>
