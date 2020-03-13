<template>
  <header class="header teal lighten-2">

    <div class="container">
      <nav>
        <div class="nav-wrapper">
          <n-link :to="route('index')" class="brand-logo">Lazuka Shop</n-link>

          <ul class="right hide-on-med-and-down">
            <li :class="{'active': $route.name === 'index'}">
              <n-link :to="route('index')">Home</n-link>
            </li>

            <li :class="{'active': $route.name === 'cart'}">
              <n-link :to="route('cart')">
                <span>Cart</span>
                <span class="cart__count">{{ cartCounter }}</span>
                <span
                  v-if="cartCounter > 0"
                  class="cart__count-price"
                >
                  {{ totalPrice }}$
                </span>
              </n-link>
            </li>

            <li
              v-show="isAuth"
              class="user-dropdown"
            >
              <div class="dropdown-trigger" ref="userMenu" data-target="user-menu">
                {{ user.name }}
                <i class="material-icons right">arrow_drop_down</i>
              </div>
            </li>

            <li v-show="!isAuth">
              <button
                @click.prevent="$showModal(loginModalId)"
                class="btn-sign-in waves-effect waves-light btn"
              >
                Sign in
              </button>
            </li>

          </ul>
        </div>
      </nav>

      <ul v-show="isAuth" id="user-menu" class="dropdown-content">
        <li v-if="isAdmin">
          <n-link :to="route('admin')">Admin</n-link>
        </li>

        <li>
          <n-link :to="route('personal-area')">Personal area</n-link>
        </li>

        <li @click.prevent="exit">
          <span>Exit</span>
        </li>
      </ul>
    </div>

    <login />
    <registration />
    <reset-password />

  </header>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex'
  import Login from "./modals/Login";
  import Registration from "./modals/Registration";
  import ResetPassword from "./modals/ResetPassword";
  import Exit from './../mixins/exit';

  export default {
    name: "Header",

    mixins: [Exit],

    methods: {
      ...mapActions('users', [
        'logout',
      ])
    },

    computed: {
      ...mapGetters('users', [
        'isAdmin',
        'isAuth',
      ]),

      ...mapState('users', [
        'user'
      ]),

      ...mapGetters('cart', [
        'cartCounter',
        'totalPrice',
      ]),
    },

    components: {
      Login,
      Registration,
      ResetPassword,
    }
  }
</script>

<style lang="sass" scoped>

  #user-menu
    left: auto !important
    right: 0
    min-width: 140px

  nav
    background-color: transparent
    box-shadow: none

  .vue-notification
    padding: 10px
    margin: 0 5px 5px
    font-size: 12px
    color: #ffffff
    background: #44A4FC
    border-left: 5px solid #187FE7

    &.warn
      background: #ffb648
      border-left-color: #f48a06

    &.error
      background: #E54D42
      border-left-color: #B82E24

    &.success
      background: #68CD86
      border-left-color: #42A85F

</style>
