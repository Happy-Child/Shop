<template>
  <ValidationObserver
    v-slot="{ handleSubmit, validate }"
    ref="observer"
  >
    <form @submit.prevent="handleSubmit(submit)" class="product-content">

      <loading v-if="curProductLoading && thisEdit" />

      <div v-else class="personal__content-image">
        <div
          @click="$refs.uploadField.click()"
          class="personal__content-wrap-cur-image"
        >
          <input @change="uploadImage" ref="uploadField" type="file">

          <img v-if="imageSrcUploaded" :src="imageSrcUploaded" alt="">
          <img v-else-if="formData.imageSrc" e :src="formData.imageSrc" alt="">
          <img v-else src="~assets/images/default_product_image.svg" alt="">

          <div class="personal__content-image-overlay"></div>
        </div>

        <button
          v-if="imageSrcUploaded"
          @click.prevent="removeUploadedImage()"
          class="waves-effect waves-light red lighten-1 btn-large"
        >
          <span>Remove image</span>
        </button>
      </div>

      <ValidationProvider rules="required" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <input
            v-model.trim="formData.name"
            id="name"
            type="text"
            class="validate"
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


      <loading v-if="categories_loading" />

      <ValidationProvider v-show="!categories_loading" rules="required" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <select
            v-model.trim="formData.category_id"
            ref="category"
            class="validate"
            :class="changed ? (valid ? 'valid' : 'invalid') : ''"
          >
            <option
              v-if="!categories.length"
              value=""
              disabled
              selected
            >No categories</option>

            <option
              v-else
              value=""
              disabled
              :selected="!product.category_id"
            >Choose category</option>

            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              :selected="product.category_id === category.id"
            >{{ category.name }}</option>
          </select>

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
          <input
            v-model.trim="formData.weight"
            id="weight"
            type="number"
            class="validate"
            :class="changed ? (valid ? 'valid' : 'invalid') : ''"
          >
          <label for="weight">Weight (kg)</label>

          <span
            v-for="(error, index) in errors"
            :key="index"
            class="red-text text-bold"
          >
            {{ error }}
          </span>
        </div>
      </ValidationProvider>

      <div class="input-field">
        <input
          v-model.trim="formData.target"
          id="target"
          type="text"
          class="validate"
        >
        <label for="target">Target</label>
      </div>

      <ValidationProvider rules="required" v-slot="{ errors, valid, changed }">
        <div class="input-field">
          <input
            v-model.trim="formData.price"
            id="price"
            type="number"
            class="validate"
            :class="changed ? (valid ? 'valid' : 'invalid') : ''"
          >
          <label for="price">Price ($)</label>

          <span
            v-for="(error, index) in errors"
            :key="index"
            class="red-text text-bold"
          >
            {{ error }}
          </span>
        </div>
      </ValidationProvider>

      <div class="row">
        <div v-if="thisEdit" class="col s6">
          <span
            @click="$showModal(questionModalId)"
            :disabled="loading || products_loading"
            class="w-100 center-box waves-effect waves-light red lighten-1 btn-large"
          >
            <loading v-if="loading || products_loading"/>
            <span v-else>Delete</span>
          </span>
        </div>

        <div class="col" :class="thisEdit ? 's6': 's12'">
          <button
            @click="validate()"
            :disabled="loading || products_loading"
            class="w-100 center-box waves-effect waves-light green lighten-1 btn-large"
          >
            <loading v-if="loading || products_loading"/>
            <span v-else>{{ thisEdit ? 'Save' : 'Create' }}</span>
          </button>
        </div>
      </div>
    </form>

    <modal
      :modalId="questionModalId"
      modalTitle="Delet this product?"
      :modalClasses="['question-modal']"
      :loading="loading"
      :closeOnConfirm="true"
      @cancel="cancel"
      @confirm="startDeleteProduct"
    ></modal>

  </ValidationObserver>
</template>

<script>
  import { defaultProductData } from '../../../../utils/config';
  import { mapActions, mapState } from 'vuex';
  import LoadingMixins from "../../../../mixins/loading";
  import FormMixins from "../../../../mixins/form";
  import Modal from "../../../Modal";
  import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
  import { required } from 'vee-validate/dist/rules';

  extend('required', {
    ...required,
    message: 'This field is required'
  });


  export default {
    name: "ProductContent",

    mixins: [LoadingMixins, FormMixins],

    props: {
      thisEdit: {
        type: Boolean
      },
      product: {
        type: Object
      },
      curProductLoading: {
        type: Boolean
      }
    },

    data() {
      return {
        formData: {},
        uploadedFile: null,
        imageSrcUploaded: null,
        product_id: this.getRouteParam('id'),
        defaultProducts: [],
        categoryInstance: '',
      }
    },

    watch: {
      products: {
        handler(products) {
          this.defaultProducts = JSON.parse(JSON.stringify(products));
        },
        deep: true,
        immediate: true
      },
      product: {
        handler(product) {
          if(product) {
            this.formData = JSON.parse(JSON.stringify(product));
          }
        },
        deep: true,
        immediate: true
      },
      categories_loading: {
        handler(loading) {
          if(!loading && !this.categoryInstance) {
            setTimeout(() => {
              this.initFormsItems();
            }, 0);
          }
        },
        deep: true,
        immediate: true
      }
    },

    methods: {
      ...mapActions('products', [
        'getProducts',
        'updateProduct',
        'createProduct',
        'deleteProduct',
      ]),

      ...mapActions('categories', [
        'getCategories'
      ]),

      uploadImage(e) {
        if(!e.target.files[0]) return;

        this.uploadedFile = e.target.files[0];
        this.imageSrcUploaded = window.URL.createObjectURL(this.uploadedFile);
      },

      removeUploadedImage() {
        this.uploadedFile = null;
        this.imageSrcUploaded = null;
        this.$refs.uploadField.value = '';
      },

      initFormsItems() {
        this.categoryInstance = M.FormSelect.init(this.$refs.category, {});
      },

      destroyFormsItems() {
        if(this.categoryInstance.destroy) this.categoryInstance.destroy();
      },

      cancel() {
        this.$hideModal();
      },

      existThisProduct(name) {
        return !!this.defaultProducts.find(product => {
          if(this.thisEdit && product.name === this.product.name) return;
          return product.name === name;
        });
      },

      submit() {
        if(this.existThisProduct(this.formData.name)) {
          this.$noty.error('This product has already exists!');
          return;
        }

        this.formSubmit();
      },

      fullFormReset() {
        this.removeUploadedImage();
        this.formReset();
        this.$refs.category.value = '';
        this.initFormsItems();
      },

      formSubmit() {
        this.setLoading(true);
        if(this.thisEdit) this.startUpdateProduct();
        else this.startCreateProduct();
      },

      startUpdateProduct() {
        let formData = {
          data: this.formData,
          id: this.product_id
        };

        if(this.uploadedFile) {
          formData.file = this.uploadedFile;
        }

        this.updateProduct(formData)
          .then(() => {
            this.setLoading(false);
            this.$noty.success('Updated!');
            this.removeUploadedImage();
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      },

      startCreateProduct() {
        let formData = {
          data: this.formData
        };

        if(this.uploadedFile) {
          formData.file = this.uploadedFile;
        }

        this.createProduct(formData)
          .then(() => {
            this.setLoading(false);
            this.$noty.success('Created!');
            this.fullFormReset();
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      },

      startDeleteProduct() {
        this.setLoading(true);

        this.deleteProduct(this.product_id)
          .then(() => {
            this.$noty.success('Deleted!');
            this.$router.push(this.route('admin-products'));
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      }
    },

    computed: {
      ...mapState('products', [
        'products',
        'products_loading',
      ]),

      ...mapState('categories', [
        'categories',
        'categories_loading',
      ])
    },

    created() {
      if(!this.thisEdit) {
        this.formData = JSON.parse(JSON.stringify(defaultProductData));
      }
    },

    mounted() {
      if(!this.products.length) {
        try {
          this.getProducts();
        }
        catch(error) {
          this.$noty.error(error.message);
        }
      }

      if(!this.categories.length) {
        try {
          this.getCategories();
        }
        catch(error) {
          this.$noty.error(error.message);
        }
      }

      M.updateTextFields();

      const modal = document.querySelectorAll(`#${this.questionModalId}`);
      M.Modal.init(modal, {});
    },

    beforeDestroy() {
      this.destroyFormsItems();
    },

    components: {
      ValidationProvider,
      ValidationObserver,
      Modal,
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

</style>
