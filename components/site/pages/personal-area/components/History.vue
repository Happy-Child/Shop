<template>
  <div class="history">

    <h4 class="personal__content-title">History</h4>

    <div v-if="cart_loading" class="center-box">
      <loading />
    </div>

    <p v-else-if="!orders.length">No orders</p>

    <template v-else>
      <div class="history__list">
        <products-group
          v-for="order in orders"
          :key="order.id"
          :order="order"
        >
          <template v-slot:topText>
            <span class="history__item-date">
              01.02.20
            </span>

            <address class="history__item-address">
              {{ order.address }}
            </address>
          </template>
        </products-group>
      </div>

      <ul class="pagination center">
        <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
        <li class="active"><a href="#!">1</a></li>
        <li class="waves-effect"><a href="#!">2</a></li>
        <li class="waves-effect"><a href="#!">3</a></li>
        <li class="waves-effect"><a href="#!">4</a></li>
        <li class="waves-effect"><a href="#!">5</a></li>
        <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
      </ul>
    </template>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import ProductsGroup from "../../../components/ProductsGroup";

  export default {
    name: "History",

    methods: {
      ...mapActions('cart', [
        'getUsersOrders'
      ])
    },

    computed: {
      ...mapState('cart', [
        'cart_loading',
        'orders',
      ])
    },

    mounted() {
      if(!this.orders.length) {
        this.getUsersOrders()
          .then(() => {})
          .catch(error => {
            this.$noty.error(error.message);
          })
      }
    },

    components: {
      ProductsGroup
    }
  }
</script>

<style scoped>

</style>
