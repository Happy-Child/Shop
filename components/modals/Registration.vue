<template>
  <modal
    :modalId="regModalId"
    modalTitle="Registration"
    :modalClasses="['reg-modal']"
    :loading="loading"
    @cancel="cancel"
    @confirm="confirm"
    @resetFormData="resetFormData"
  >
    <template slot="body">
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

      <ValidationProvider rules="required|minmax:8,20|password:@confirm_password" v-slot="{ errors, valid, changed }">
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

      <ValidationProvider rules="required" vid="confirm_password" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <input
            v-model.trim="confirm_password"
            id="confirm_password"
            type="password"
            :class="changed ? (valid ? 'valid' : 'invalid') : ''"
          >
          <label for="confirm_password">Confirm password</label>
          <span
            v-for="(error, index) in errors"
            :key="index"
            class="red-text text-bold"
          >
            {{ error }}
          </span>
        </div>
      </ValidationProvider>

      <ValidationProvider rules="required" v-slot="{ errors, valid }">
        <p class="radio-group">
          <span>Gender:</span>

          <label>
            <input v-model="formData.gender" value="male" type="radio" />
            <span>Male</span>
          </label>

          <label>
            <input v-model="formData.gender" value="female" type="radio" />
            <span>Female</span>
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
    </template>

    <template slot="under-body">
      <p>
        <span>Have an account?</span>
        <span
          class="text-bold blue-text text-darken-2 pointer"
          @click.prevent="$showModal(loginModalId)"
        >
          Sing in
        </span>
      </p>
    </template>
  </modal>
</template>

<script>
  import { mapActions } from 'vuex'
  import Modal from "../Modal";
  import LoadingMixins from "../../mixins/loading";
  import FormMixins from "../../mixins/form";
  import { ValidationProvider, extend } from 'vee-validate';
  import { required, email } from 'vee-validate/dist/rules';

  extend('minmax', {
    validate: (value, { min, max }) => {
      return (value.length >= min) && (value.length <= max)
    },
    params: ['min', 'max'],
    message: 'The {_field_} field must have at least {min} characters and {max} characters at most'
  });

  extend('password', {
    validate: (value, { target }) => {
      return value === target;
    },
    params: ['target'],
    message: 'Password confirmation does not match'
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
    name: "Registration",

    mixins: [LoadingMixins, FormMixins],

    data() {
      return {
        formData: {
          name: null,
          email: null,
          password: null,
          gender: null
        },
        confirm_password: null
      }
    },

    methods: {
      ...mapActions('users', [
        'registration'
      ]),

      resetFormData() {
        this.clearFields();
        this.confirm_password = null;
      },

      cancel() {
        this.$hideModal();
      },

      confirm() {
        this.setLoading(true);
        this.formSubmit();
      },

      formSubmit() {
        this.registration(this.formData)
          .then(() => {
            this.$hideModal();
            this.setLoading(false);
            this.$noty.success('You are registered!');
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
