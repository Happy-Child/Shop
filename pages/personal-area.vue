<template>
  <div class="personal">
    <h2>Personal area</h2>

    <div class="row">
      <areaSidebar
        @changeTab="changeTab"
        :cur-tab="curTab"
      />

      <areaContent
        :cur-tab="curTab"
        :orders="orders"
      />
    </div>
  </div>
</template>

<script>
  import AreaSidebar from "../components/site/pages/personal-area/Sidebar";
  import AreaContent from "../components/site/pages/personal-area/Content";

  export default {
    name: "personal-area",

    middleware: ['check-auth'],

    async asyncData({ store, error }) {
      try {
        let orders = store.state.cart.orders;

        if(!orders.length) {
          await store.dispatch('cart/getUsersOrders');
          orders = store.state.cart.orders;
        }

        return {
          orders
        }
      }
      catch(e) {
        error({ statusCode: 400, message: e.message });
      }
    },

    data() {
      return {
        orders: [],
        curTab: 'user-data'
      }
    },

    methods: {
      changeTab(tab) {
        this.curTab = tab;
      }
    },

    components: {
      AreaSidebar,
      AreaContent
    }
  }
</script>

<style scoped>

</style>
