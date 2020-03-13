<template>

  <div class="checkout">
    <template v-if="cart.length">
      <h2>Checkout</h2>
      <checkout-form />
    </template>

    <template v-else>
      <empty />
    </template>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import CheckoutForm from "../components/site/pages/checkout/CheckoutForm";
  import Empty from "../components/site/pages/cart/Empty";

  export default {
    name: "checkout",

    computed: {
      ...mapState('cart', [
        'cart'
      ])
    },

    components: {
      CheckoutForm,
      Empty,
    }
  }
</script>

<style scoped>

</style>
