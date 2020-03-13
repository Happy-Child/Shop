<template>

  <div class="empty-cart">
    <h3 class="empty-cart__title">
      <i class="material-icons">delete_forever</i>
      <span class="empty-cart__title-text">Cart empty</span>
    </h3>
    <n-link to="/" class="waves-effect waves-light btn green lighten-1">
      <i class="material-icons left">add_shopping_cart</i>
      Added products
    </n-link>
  </div>

</template>

<script>
  export default {
    name: "Empty"
  }
</script>

<style scoped>

  .empty-cart {
    padding: 5rem 0;
    text-align: center;
  }

  .empty-cart__title,
  .empty-cart__title > * {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .empty-cart__title {
    margin-bottom: 3rem;
  }

  .empty-cart__title i {
    font-size: 90px;
    margin-bottom: 1rem;
  }

</style>
