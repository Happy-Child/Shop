<template>
  <modal
    :modalId="resetModalId"
    modalTitle="Reset password"
    :modalClasses="['reset-modal']"
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
    </template>

    <template slot="under-body" v-if="!isAuth">
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
  import { mapActions, mapState, mapGetters } from 'vuex'
  import Modal from "../Modal";
  import LoadingMixins from "../../mixins/loading";
  import FormMixins from "../../mixins/form";
  import { ValidationProvider, extend } from 'vee-validate';
  import { required, email } from 'vee-validate/dist/rules';

  extend('email', {
    ...email,
    message: 'Email invalid'
  });

  extend('required', {
    ...required,
    message: 'This field is required'
  });


  export default {
    name: "ResetPassword",

    mixins: [LoadingMixins, FormMixins],

    data() {
      return {
        formData: {
          email: null,
        }
      }
    },

    watch: {
      user: {
        handler(user) {
          this.formData = JSON.parse(JSON.stringify(user));
        },
        deep: true,
        immediate: true,
      }
    },

    methods: {
      ...mapActions('users', [
        'recoveryPassword'
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
        this.recoveryPassword(this.formData)
          .then(() => {
            this.$hideModal();
            this.setLoading(false);
            this.$noty.info('Password reset message sent to your email!');
            this.resetFormData();
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      }
    },

    computed: {
      ...mapState('users', [
        'user'
      ]),
      ...mapGetters('users', [
        'isAuth'
      ])
    },

    components: {
      Modal,
      ValidationProvider,
    }
  }
</script>

<style scoped>

</style>
