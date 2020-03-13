<template>
  <footer class="page-footer center-align">
    <div class="footer-copyright">
      <div class="container">
        © {{ new Date().getFullYear() }} Egor Lazuka
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: "Footer"
  }
</script>

<style lang="sass" scoped>

  .page-footer
    padding-top: 0

</style>
