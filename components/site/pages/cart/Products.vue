<template>

  <div class="row">
    <div
      v-for="product in cart"
      :key="product.id"
      class="col s12 m4 l3"
    >
      <product-card
        :product="product"
        :cart-mode="true"
      />
    </div>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import ProductCard from "../../../ProductCard";

  export default {
    name: "Products",

    computed: {
      ...mapState('cart', [
        'cart',
      ]),
    },

    components: {
      ProductCard,
    }
  }
</script>

<style scoped>

  .col {
    float: none;
    margin: 0 0 1.5rem !important;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
  }

</style>
