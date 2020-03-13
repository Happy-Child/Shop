<template>
  <div class="default stretch-box">

    <app-header />

    <main class="stretch-box">
      <div class="container stretch-box">
        <nuxt />
      </div>
    </main>

    <app-footer />

  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import AppHeader from "../components/Header";
  import AppFooter from "~/components/site/components/Footer";
  import {
    CLEAR_CATEGORIES,
    CLEAR_PRODUCTS,
    CLEAR_ORDERS
  } from "../utils/mutations-types";

  export default {
    name: "default",

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

    mounted() {
      const modals = document.querySelectorAll('.modal');

      M.Modal.init(modals, {
        dismissible: false
      });
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
    }
  }
</script>

<style>

  .default,
  .admin {
    min-height: 100vh;
  }

  .stretch-box {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .default > main,
  .admin > main {
    padding-bottom: 4rem;
  }

  .pointer {
    cursor: pointer;
  }

  .w-100 {
    width: 100% !important;
  }

  .cart__count {
    border-radius: 3px;
    margin-left: .3rem;
    background-color: #fff;
    color: #000;
    padding: 0 .4rem;
  }

  .row {
    margin-left: -0.75rem;
    margin-right: -0.75rem;
  }

  .user-dropdown,
  .btn-sign-in {
    margin-left: 1rem;
  }

  .ml-auto {
    margin-left: auto;
  }

  .mr-auto {
    margin-right: auto;
  }

  .filter-item .select-wrapper {
    width: 100%;
  }

  .text-bold {
    font-weight: bold;
  }

  .radio-group > * {
    margin-right: 1rem;
  }

  .d-flex {
    display: flex;
  }

  .align-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .center-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pt-0 {
    padding-top: 0 !important;
  }

  .wrap-img img {
    width: 100%;
    max-width: 100%;
    height: auto;
    object-position: center;
    object-fit: cover;
  }

  .pagination {
    margin: 2rem 0 0;
  }

  .pagination * {
    outline: none;
  }

  .m-0 {
    margin: 0 !important;
  }

  .w-50 {
    width: 100%;
    max-width: 50%;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }

  .input-field > label {
    pointer-events: none;
  }

</style>
