<template>
  <ValidationObserver
    v-slot="{ handleSubmit, validate }"
    tag="div"
    class="d-flex checkout__form"
    ref="observer"
  >

    <form @submit.prevent="handleSubmit(submit)" class="checkout__form-fields w-50">
      <ValidationProvider rules="required" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <input
            v-model.trim="formData.name"
            id="name"
            type="text"
            :class="changed ? (valid ? 'valid' : 'invalid') : ''"
          >
          <label for="name">Name</label>
          <span
            v-for="(error, index) in errors"
            :key="index"
            class="red-text text-bold"
          >
            {{ error }}
          </span>
        </div>
      </ValidationProvider>

      <ValidationProvider rules="required|email" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <input
            v-model.trim="formData.email"
            id="email"
            type="text"
            :class="changed ? (valid ? 'valid' : 'invalid') : ''"
          >
          <label for="email">Email</label>
          <span
            v-for="(error, index) in errors"
            :key="index"
            class="red-text text-bold"
          >
            {{ error }}
          </span>
        </div>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <div class="input-field m-0">
            <input
              v-model.trim="formData.address"
              id="address"
              type="text"
              class="validate"
              placeholder="Address"
              :class="changed ? (valid ? 'valid' : 'invalid') : ''"
            >
          </div>

          <span
            v-for="(error, index) in errors"
            :key="index"
            class="red-text text-bold"
          >
            {{ error }}
          </span>

          <div
            v-if="user.addresses.length"
            class="wrap-saved-addresses"
          >
            <span class="title">Saved addresses:</span>

            <div class="d-flex flex-wrap">
              <label
                v-for="(address, index) in user.addresses"
                :key="index"
                class="save-address"
              >
                <input v-model="formData.address" :value="address.name" type="radio" />
                <span>{{ address.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors, valid }">
        <p class="radio-group">
          <span>Payment method:</span>

          <label>
            <input v-model="formData.payment" value="cash" type="radio" />
            <span>Cash</span>
          </label>

          <label>
            <input v-model="formData.payment" value="card" type="radio" />
            <span>Bank card</span>
          </label>

          <label>
            <input v-model="formData.payment" value="online" type="radio" />
            <span>Online payment</span>
          </label>
        </p>

        <span
          v-for="(error, index) in errors"
          :key="index"
          class="red-text text-bold"
        >
          {{ error }}
        </span>
      </ValidationProvider>

      <div class="input-field">
        <textarea
          v-model="formData.comment"
          id="textarea"
          ref="comment"
          class="materialize-textarea"
          data-length="120"
        ></textarea>
        <label for="textarea">Comment to order</label>
      </div>

      <button
        @click="validate()"
        :disabled="cart_loading"
        class="center-box waves-effect waves-light btn-large green lighten-1"
      >
        <loading v-if="cart_loading"/>
        <span v-else>
          <i class="material-icons left">check</i>
          <span>To order</span>
        </span>
      </button>
    </form>

    <div class="checkout__form-info w-50">
      <products-group
        :order="{ products: cart }"
      >
        <template v-slot:topText>
          <span class="history__item-date">
            Product list
          </span>
        </template>
      </products-group>
    </div>

  </ValidationObserver>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex'
  import ProductsGroup from "../../components/ProductsGroup";
  import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
  import { required, email } from 'vee-validate/dist/rules';

  extend('minmax', {
    validate: (value, { min, max }) => {
      return (value.length >= min) && (value.length <= max)
    },
    params: ['min', 'max'],
    message: 'The {_field_} field must have at least {min} characters and {max} characters at most'
  });

  extend('email', {
    ...email,
    message: 'Email invalid'
  });

  extend('required', {
    ...required,
    message: 'This field is required'
  });


  export default {
    name: "CheckoutForm",

    data() {
      return {
        formData: {
          date: null,
          name: null,
          email: null,
          payment: null,
          address: null,
          comment: null,
          user_id: null
        }
      }
    },

    watch: {
      isAuth: {
        handler(isAuth) {
          if(isAuth) {
            this.formData.name = this.user.name;
            this.formData.email = this.user.email;
            M.updateTextFields();
          }
        },
        immediate: true
      }
    },

    methods: {
      ...mapActions('cart', [
        'checkoutOrder',
      ]),

      submit() {
        this.formSubmit();
      },

      formSubmit() {
        if(this.user.uid) {
          this.formData.user_id = this.user.uid;
        }

        this.checkoutOrder(this.formData)
          .then(() => {
            this.$noty.success('Ordered!');
            this.$router.push(this.route('index'));
          })
          .catch(error => {
            this.$noty.error(error.message);
          });
      }
    },

    computed: {
      ...mapGetters('users', [
        'isAuth'
      ]),

      ...mapState('users', [
        'user',
        'user_loading'
      ]),

      ...mapState('cart', [
        'cart',
        'cart_loading'
      ])
    },

    mounted() {
      M.updateTextFields();
    },

    components: {
      ProductsGroup,
      ValidationProvider,
      ValidationObserver,
    }
  }
</script>

<style lang="sass" scoped>

  .checkout

    &__form
      margin-left: -12px
      margin-right: -12px

      > *
        padding: 0 12px

      &-fields

        > *
          margin-bottom: 1.5rem


  .wrap-saved-addresses
    padding-top: 1.5rem

    .title
      display: block
      margin-bottom: .5rem

    .save-address
      display: flex
      margin-bottom: .3rem
      padding-right: 1rem
      width: 100%

      &:last-child
        margin-bottom: 0


</style>
