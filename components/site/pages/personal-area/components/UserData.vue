<template>
  <ValidationObserver
    v-slot="{ handleSubmit, validate }"
    ref="observer"
  >
    <form @submit.prevent="handleSubmit(submit)" class="user-data">

      <h4 class="personal__content-title">User data</h4>


      <loading v-if="user_loading" />

      <ValidationProvider
        v-else
        class="personal__content-image"
        rules="image|size:1000"
        ref="fileProvider"
        v-slot="{ validate, errors }"
      >
        <div
          @click="$refs.uploadField.click()"
          class="personal__content-wrap-cur-image"
        >
          <input
            @change="uploadImage"
            ref="uploadField"
            type="file"
          >

          <img v-if="imageSrcUploaded" :src="imageSrcUploaded" alt="">
          <img v-else-if="formData.imageSrc" :src="formData.imageSrc" alt="">
          <img v-else src="~assets/images/default_user_image.svg" alt="">

          <div class="personal__content-image-overlay"></div>
        </div>

        <div>
          <div class="text-bold">Max file size 1MB</div>

          <button
            v-if="imageSrcUploaded"
            @click.prevent="removeUploadedImage()"
            class="my-1 waves-effect waves-light red lighten-1 btn-large"
          >
            <span>Remove image</span>
          </button>
        </div>
      </ValidationProvider>


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

      <ValidationProvider v-slot="{ errors, valid }">
        <div class="input-field">
          <input
            v-model.trim="formData.data_birthday"
            @change="setDataBirthday"
            type="text"
            ref="datepicker"
            class="datepicker"
          >
          <label for="email">Birthday</label>
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

      <div
        v-if="!isAdmin"
        class="address-box d-flex justify-between input-field"
      >
        <div class="address-box__control">
          <p>Delivery addresses</p>
          <div class="address-box__input d-flex">
            <input v-model.trim="addressComputed" id="address" placeholder="Address" type="text" class="validate">

            <button
              :disabled="!addressComputed"
              @click.prevent="addAddress"
              class="address-box__input-btn waves-effect waves-light blue lighten-1 btn pointer"
            >
              <i class="material-icons address-box__input-icon">add</i>
            </button>
          </div>
        </div>

        <ul class="address-box__list">
          <template v-if="formData.addresses.length">
            <li
              v-for="address in formData.addresses"
              :key="address.id"
              class="address-box__list-item"
            >
              <address>{{ address.name }}</address>

              <i
                @click.prevent="removeAddress(address.name)"
                class="material-icons pointer"
              >
                delete_forever
              </i>
            </li>
          </template>

          <li v-else class="address-box__list-item">
            Addresses empty
          </li>
        </ul>
      </div>

      <div class="uset-data__bottom d-flex align-center justify-between">
        <p>
          <span>Forgot password?</span>
          <span
            class="text-bold blue-text text-darken-2 pointer"
            @click.prevent="$showModal(resetModalId)"
          >
            Password recovery
          </span>
        </p>

        <button
          @click="validate()"
          :disabled="user_loading"
          class="user-data__save-btn center-box waves-effect waves-light green lighten-1 btn-large"
        >
          <loading v-if="user_loading"/>
          <span v-else>Save</span>
        </button>
      </div>

    </form>
  </ValidationObserver>
</template>

<script>
  import { defaultUserData } from '../../../../../utils/config';
  import { mapActions, mapState } from 'vuex'
  import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
  import { required, email, image, size } from 'vee-validate/dist/rules';

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

  extend('image', {
    ...image,
    message: 'Invalid file format'
  });

  extend('size', {
    ...size,
    message: 'Exceeds the permissible size'
  });

  extend('required', {
    ...required,
    message: 'This field is required'
  });


  export default {
    name: "UserData",

    data() {
      return {
        formData: {
          ...defaultUserData
        },
        uploadedFile: null,
        imageSrcUploaded: null,
        address: null,
        datepickerInstance: '',
      }
    },

    watch: {
      user: {
        handler(user) {
          if(user.uid) {
            this.formData = JSON.parse(JSON.stringify(user));
          }
        },
        deep: true,
        immediate: true,
      }
    },

    methods: {
      ...mapActions('users', [
        'userUpdate',
      ]),

      async uploadImage(e) {
        const provider = this.$refs.fileProvider;
        const { valid } = await provider.validate(e);

        if(!valid) {
          this.$noty.error(provider.errors.join('\n'));
          if(provider) provider.value = '';
          return;
        }

        this.uploadedFile = e.target.files[0];
        this.imageSrcUploaded = window.URL.createObjectURL(this.uploadedFile);
      },

      removeUploadedImage() {
        this.uploadedFile = null;
        this.imageSrcUploaded = null;
        if(this.$refs.fileProvider) this.$refs.fileProvider.value = '';
        if(this.$refs.uploadField) this.$refs.uploadField.value = '';
      },

      initFormsItems() {
        this.datepickerInstance = M.Datepicker.init(this.$refs.datepicker, {});
      },

      destroyFormsItems() {
        if(this.datepickerInstance.destroy) this.datepickerInstance.destroy();
      },

      setDataBirthday() {
        const date = this.datepickerInstance.toString();
        this.formData.data_birthday = date;
      },

      addAddress() {
        if(!this.address || this.isAdmin) return;

        if(this.existThisAddress(this.address)) {
          this.$noty.error('This address has already been added!');
          return;
        }

        this.formData.addresses.push({
          name: this.address,
        });

        this.address = null;
      },

      existThisAddress(name) {
        return !!this.formData.addresses.find(address => address.name === name);
      },

      removeAddress(name) {
        this.formData.addresses = this.formData.addresses.filter(address => {
          return address.name !== name;
        })
      },

      submit() {
        this.formSubmit();
      },

      formSubmit() {
        let userData = {
          data: this.formData
        };

        if(this.uploadedFile) {
          userData.file = this.uploadedFile;
        }

        this.userUpdate(userData)
          .then(() => {
            this.$noty.success('Updated!');
            this.removeUploadedImage();
          })
          .catch(error => {
            this.$noty.error(error.message);
          });
      }
    },

    computed: {
      ...mapState('users', [
        'user',
        'user_loading',
      ]),

      addressComputed: {
        get() {
          return this.address;
        },

        set(name) {
          this.address = name.replace(/\s{2,}/g, ' ');
        }
      }
    },

    mounted() {
      setTimeout(() => {
        this.initFormsItems();
        M.updateTextFields();
      }, 0);
    },

    beforeDestroy() {
      this.destroyFormsItems();
    },

    components: {
      ValidationProvider,
      ValidationObserver,
    }
  }
</script>

<style lang="sass" scoped>

  .personal
    &__content

      &-image
        display: flex
        align-items: center

      &-wrap-cur-image
        position: relative
        width: 20rem
        border: 1px solid rgba(0, 0, 0, .1)
        cursor: pointer
        border-radius: 100%
        overflow: hidden
        margin-right: 3rem

        &:hover
          .personal__content-image-overlay
            opacity: 1

        &:before
          content: ''
          padding-top: 100%
          display: block
          z-index: -1

        .personal__content-image-overlay
          opacity: 0
          transition: .3s all ease
          z-index: 1
          background-color: rgba(0, 0, 0, .7)
          width: 100%
          height: 100%

          &:after
            content: ''
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)

          &:after
            width: 40%
            height: 40%
            background: url('~assets/images/upload_image.svg') center/contain no-repeat


        input
          display: none

        img
          object-fit: cover
          object-position: center

        img,
        .personal__content-image-overlay
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%


    .user-data__save-btn
    width: 50%


  .uset-data__bottom
    margin-top: 2rem


  .address-box
    margin-left: -12px
    margin-right: -12px


  .address-box > *
    width: 50%
    padding: 0 12px


  .address-box__list
    padding-top: 1.9rem


  .address-box__list-item
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: 1px solid rgba(0, 0, 0, .1)
    padding: 1rem 0


  .address-box__input
    align-items: stretch


  .address-box__input input
    margin-bottom: 0


  .address-box__input-btn
    flex-shrink: 0
    width: 45px
    display: flex
    align-items: center
    justify-content: center
    border-radius: 4px
    border: none
    box-shadow: none
    margin-left: 1rem
    height: auto


  .address-box__input-icon
    color: #fff


</style>
