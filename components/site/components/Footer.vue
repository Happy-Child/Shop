<template>
  <footer class="page-footer">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5 class="white-text">Lazuka Shop</h5>
        </div>

        <div class="col l4 offset-l2 s12">
          <h5 class="white-text">Links</h5>

          <ul>
            <li>
              <n-link to="/" class="grey-text text-lighten-3" href="#!">Home</n-link>
            </li>

            <li>
              <n-link to="cart" class="grey-text text-lighten-3" href="#!">
                <span>Cart</span>
                <span class="cart__count">0</span>
              </n-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

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

<style scoped>

</style>
