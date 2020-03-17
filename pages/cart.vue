<template>

  <div class="cart">
    <template v-if="cart.length">
      <h2>Cart</h2>
      <products />
      <bottom-form />
    </template>

    <template v-else>
      <empty />
    </template>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import Products from "../components/site/pages/cart/Products";
  import BottomForm from "../components/site/pages/cart/Form";
  import Empty from "../components/site/pages/cart/Empty";

  export default {
    name: "cart",

    watch: {
      isAdmin: {
        handler(isAdmin) {
          if(isAdmin) {
            this.$router.push(this.route('index', null, { info: 'only_default_user' }));
          }
        },
        immediate: true
      }
    },

    computed: {
      ...mapState('cart', [
        'cart'
      ])
    },

    components: {
      Products,
      BottomForm,
      Empty,
    }
  }
</script>

<style scoped>

</style>
