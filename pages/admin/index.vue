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
  import { mapState } from 'vuex'
  import getProdCatMixin from '../../mixins/getProdCat'

  export default {
    name: "Admin",

    layout: 'admin',

    mixins: [getProdCatMixin],

    computed: {
      ...mapState('categories', [
        'categories_loading',
      ]),

      ...mapState('products', [
        'products_loading',
      ])
    }
  }
</script>

<style lang="sass" scoped>


</style>
