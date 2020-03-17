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
      :products="products"
      :categories="categories"
    />

  </div>
</template>

<script>
  import ProductContent from "../../../../components/admin/pages/products/ProductContent";
  import getProdCatMixin from "../../../../mixins/getProdCat";

  export default {
    layout: 'admin',

    mixins: [getProdCatMixin],

    data() {
      return {
        thisEdit: !!this.getRouteParam('id')
      }
    },

    computed: {
      product() {
        if(!this.thisEdit) return false;

        const id = this.getRouteParam('id');
        return this.products.find(product => product.id === id);
      }
    },

    components: {
      ProductContent
    }
  }
</script>

<style scoped>

</style>
