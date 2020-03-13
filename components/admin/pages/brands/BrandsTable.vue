<template>
  <table>

    <thead>
      <tr>
        <th>Name</th>
        <th>Products</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="category in categories" :key="category.id">
        <td>{{ category.name }}</td>

        <td>{{ getProductsCountInCategory(category.id) }}</td>

        <td>
          <n-link
            :to="route('admin-brands-id', {id: category.id})"
            class="waves-effect waves-light btn"
          >
            Change
          </n-link>
        </td>
      </tr>
    </tbody>

  </table>
</template>

<script>
  export default {
    name: "BrandsTable",

    props: {
      categories: {
        type: Array
      },
      products: {
        type: Array
      }
    },

    methods: {
      getProductsCountInCategory(category_id) {
        return this.products.filter(product => product.category_id === category_id).length;
      }
    },

    mounted() {
      M.updateTextFields();
    },

  }
</script>

<style lang="sass" scoped>

  table
    td
      &:nth-child(1)
        width: 60%

      &:nth-child(2)
        width: 25%

      &:nth-child(3)
        width: 15%

</style>
