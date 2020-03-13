<template>
  <div class="admin__content">

    <div class="d-flex align-center justify-between">
      <h3 v-if="thisEdit" class="admin__content-title">Edit product</h3>
      <h3 v-else class="admin__content-title">Create product</h3>

      <n-link :to="route('admin-products')" class="waves-effect waves-light btn">
        <i class="material-icons left">arrow_back</i>
        Back
      </n-link>
    </div>

    <product-content
      :this-edit="thisEdit"
      :product="product"
      :curProductLoading="curProductLoading"
    />

  </div>
</template>

<script>
  import ProductContent from "../../../../components/admin/pages/products/ProductContent";

  export default {
    layout: 'admin',

    async asyncData ({ store, params, error }) {
      if(params.id) {

        try {
          const product = await store.dispatch('products/getProductById', params.id);

          if(product) {
            return {
              product,
              curProductLoading: false
            };
          } else {
            throw({ statusCode: 404, message: 'Product with id not found' });
          }
        } catch (e) {
          error({ statusCode: 404, message: e.message });
        }

      }
    },

    data() {
      return {
        product: {},
        curProductLoading: true,
        thisEdit: !!this.getRouteParam('id')
      }
    },

    components: {
      ProductContent
    }
  }
</script>

<style scoped>

</style>
