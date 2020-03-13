<template>

  <modal
    :modalId="loginModalId"
    modalTitle="Login"
    :modalClasses="['login-modal']"
    :loading="loading"
    @cancel="cancel"
    @confirm="confirm"
    @resetFormData="resetFormData"
  >
    <template slot="body">
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

      <ValidationProvider rules="required|minmax:8,20" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <input
            v-model.trim="formData.password"
            id="password"
            type="password"
            :class="changed ? (valid ? 'valid' : 'invalid') : ''"
          >
          <label for="password">Password</label>
          <span
            v-for="(error, index) in errors"
            :key="index"
            class="red-text text-bold"
          >
            {{ error }}
          </span>
        </div>
      </ValidationProvider>
    </template>

    <template slot="under-body">
      <p>
        <span>No account?</span>
        <span
          class="text-bold blue-text text-darken-2 pointer"
          @click.prevent="$showModal(regModalId)"
        >
          Sing up
        </span>
      </p>

      <p>
        <span>Forgot password?</span>
        <span
          class="text-bold blue-text text-darken-2 pointer"
          @click.prevent="$showModal(resetModalId)"
        >
          Password recovery
        </span>
      </p>
    </template>
  </modal>

</template>

<script>
  import { mapActions } from 'vuex'
  import Modal from "../Modal";
  import FormMixins from "../../mixins/form";
  import LoadingMixins from "../../mixins/loading";
  import { ValidationProvider, extend } from 'vee-validate';
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
    name: "Login",

    mixins: [LoadingMixins, FormMixins],

    data() {
      return {
        formData: {
          email: null,
          password: null,
        }
      }
    },

    methods: {
      ...mapActions('users', [
        'login'
      ]),

      cancel() {
        this.$hideModal();
      },

      confirm() {
        this.setLoading(true);
        this.formSubmit();
      },

      resetFormData() {
        this.clearFields();
      },

      formSubmit() {
        this.login(this.formData)
          .then(() => {
            this.$hideModal();
            this.setLoading(false);
            this.$noty.success('You are logged in!');
            this.resetFormData();
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      }
    },

    components: {
      Modal,
      ValidationProvider,
    }
  }
</script>

<style scoped>

</style>
