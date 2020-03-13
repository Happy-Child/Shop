<template>
  <div class="admin stretch-box">

    <app-header />

    <main class="admin__main stretch-box">
      <div class="container stretch-box">
        <div class="row">
          <app-sidebar />
          <div class="col s12 m8 l9">
            <nuxt />
          </div>
        </div>
      </div>
    </main>

    <app-footer />

  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import AppHeader from "../components/Header";
  import AppFooter from "../components/admin/components/Footer";
  import AppSidebar from "../components/admin/components/Sidebar";
  import {
    CLEAR_CATEGORIES,
    CLEAR_PRODUCTS,
    CLEAR_ORDERS
  } from "../utils/mutations-types";

  export default {
    name: "Admin",

    methods: {
      ...mapMutations('products', [
        CLEAR_PRODUCTS
      ]),

      ...mapMutations('categories', [
        CLEAR_CATEGORIES
      ]),

      ...mapMutations('cart', [
        CLEAR_ORDERS
      ]),
    },

    beforeDestroy() {
      this.$destroyModal();
      this[CLEAR_PRODUCTS]();
      this[CLEAR_CATEGORIES]();
      this[CLEAR_ORDERS]();
    },

    components: {
      AppHeader,
      AppFooter,
      AppSidebar,
    }
  }
</script>

<style lang="sass">

  .admin__content-title
    margin-top: 0

  .admin__main
    margin-top: 2.3rem

</style>
