<template>
  <div class="col s12 m4 l3">
    <aside class="admin__sidebar">

      <div class="collection">
        <n-link
          class="collection-item"
          :to="route('admin')"
          exact
        >
          Dashboard
        </n-link>

        <n-link
          class="collection-item"
          :to="route('admin-products')"
        >
          Products
        </n-link>

        <n-link
          class="collection-item"
          :to="route('admin-brands')"
        >
          Brands
        </n-link>
      </div>

    </aside>
  </div>
</template>

<script>
  export default {
    name: "Sidebar"
  }
</script>

<style scoped>

</style>
