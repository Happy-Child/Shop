<template>
  <div class="bottom-form">

    <h3 class="total-price blue-text">
      <i class="material-icons left">shopping_cart</i>
      <span>{{ totalPrice }}$</span>
    </h3>

    <n-link
      :to="route('checkout')"
      class="waves-effect waves-light btn-large green lighten-1"
    >
      <i class="material-icons left">check</i>
      Order
    </n-link>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "Form",

    methods: {
      submit() {

      }
    },

    computed: {
      ...mapGetters('cart', [
        'totalPrice'
      ])
    }
  }
</script>

<style scoped>

  .bottom-form {
    border-top: 1px solid rgba(0, 0, 0, .1);
    padding-top: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
  }

  .bottom-form > * {
    margin: 0;
  }

  .total-price {
    display: flex;
    align-items: center;
    font-size: 45px;
  }

  .total-price i {
    font-size: 40px;
  }

</style>
