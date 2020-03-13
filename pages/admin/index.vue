<template>
  <div class="admin__content">

    <h3 class="admin__content-title">Dashboard</h3>

    <div v-if="products_loading || categories_loading" class="center-box">
      <loading />
    </div>

    <div v-else class="admin__content-info">
      <h6>Всего товаров: <strong>{{ products.length }}</strong></h6>
      <h6>Всего брэндов: <strong>{{ categories.length }}</strong></h6>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    name: "Admin",

    layout: 'admin',

    methods: {
      ...mapActions('categories', [
        'getCategories',
      ]),

      ...mapActions('products', [
        'getProducts',
      ]),
    },

    computed: {
      ...mapState('categories', [
        'categories',
        'categories_loading',
      ]),

      ...mapState('products', [
        'products',
        'products_loading',
      ])
    },

    mounted() {
      if(!this.categories.length) {
        try {
          this.getCategories();
        }
        catch(error) {
          this.$noty.error(error.message);
        }
      }

      if(!this.products.length) {
        try {
          this.getProducts();
        }
        catch(error) {
          this.$noty.error(error.message);
        }
      }
    },
  }
</script>

<style lang="sass" scoped>


</style>
