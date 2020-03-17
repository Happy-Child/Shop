<template>
  <div class="admin__content">

    <div class="d-flex align-center justify-between">
      <h3 v-if="thisEdit" class="admin__content-title">Edit brand</h3>
      <h3 v-else class="admin__content-title">Create brand</h3>

      <n-link :to="route('admin-brands')" class="waves-effect waves-light btn">
        <i class="material-icons left">arrow_back</i>
        Back
      </n-link>
    </div>

    <brand-content
      :this-edit="thisEdit"
      :category="category"
      :products="products"
      :categories="categories"
    />

  </div>
</template>

<script>
  import BrandContent from "../../../../components/admin/pages/brands/BrandContent";
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
      category() {
        if(!this.thisEdit) return false;

        const id = this.getRouteParam('id');
        return this.categories.find(category => category.id === id);
      }
    },

    components: {
      BrandContent
    }
  }
</script>

<style scoped>

</style>
