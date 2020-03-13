<template>
  <div class="content center-box stretch-box">
    <h1 class="content__title">404</h1>

    <nuxt-link
      class="content__btn waves-effect waves-light green lighten-1 btn-large"
      :to="route('index')"
    >
      To home
    </nuxt-link>
  </div>
</template>

<script>
  export default {
    name: "error"
  }
</script>

<style lang="sass" scoped>

  .content
    flex-direction: column

    &__title
      margin-bottom: 2rem
      font-size: 12rem

    &__btn


</style>
