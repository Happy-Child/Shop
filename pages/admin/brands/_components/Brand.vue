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
    />

  </div>
</template>

<script>
  import BrandContent from "../../../../components/admin/pages/brands/BrandContent";

  export default {
    layout: 'admin',

    async asyncData ({ store, params, error }) {
      if(params.id) {

        try {
          const category = await store.dispatch('categories/getCategoryById', params.id);

          if(category) {
            return { category };
          } else {
            throw({ statusCode: 404, message: 'Category with id not found' });
          }
        } catch (e) {
          error({ statusCode: 404, message: e.message });
        }

      }
    },

    data() {
      return {
        category: {},
        thisEdit: !!this.getRouteParam('id')
      }
    },

    components: {
      BrandContent
    }
  }
</script>

<style scoped>

</style>
