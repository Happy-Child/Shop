<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit, validate }">
    <form @submit.prevent="handleSubmit(submit)" class="product-content">

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

      <div class="row">
        <div v-if="thisEdit" class="col s6">
          <button
            @click.prevent="$showModal(questionModalId)"
            :disabled="loading || categories_loading"
            class="w-100 center-box waves-effect waves-light red lighten-1 btn-large"
          >
            <loading v-if="loading || categories_loading"/>
            <span v-else>Delete</span>
          </button>
        </div>

        <div class="col" :class="thisEdit ? 's6': 's12'">
          <button
            @click="validate()"
            :disabled="loading || categories_loading"
            class="w-100 center-box waves-effect waves-light green lighten-1 btn-large"
          >
            <loading v-if="loading || categories_loading"/>
            <span v-else>{{ thisEdit ? 'Save' : 'Create' }}</span>
          </button>
        </div>
      </div>

    </form>

    <modal
      :modalId="questionModalId"
      modalTitle="Delet this category?"
      :modalClasses="['question-modal']"
      :loading="loading"
      :closeOnConfirm="true"
      @cancel="cancel"
      @confirm="checkCategoryBeforeDelete"
    ></modal>

  </ValidationObserver>
</template>

<script>
  import { defaultProductData } from '../../../../utils/config';
  import { mapActions, mapState } from 'vuex'
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
    name: "BrandContent",

    mixins: [LoadingMixins, FormMixins],

    props: {
      thisEdit: {
        type: Boolean
      },
      category: {
        type: Object,
      },
    },

    data() {
      return {
        formData: {
          name: null,
        },
        category_id: this.getRouteParam('id'),
        defaultCategories: []
      }
    },

    watch: {
      categories: {
        handler(categories) {
          this.defaultCategories = JSON.parse(JSON.stringify(categories));
        },
        deep: true,
        immediate: true
      },
      category: {
        handler(category) {
          this.formData = JSON.parse(JSON.stringify(category));
        },
        deep: true,
        immediate: true
      }
    },

    methods: {
      ...mapActions('categories', [
        'getCategories',
        'createCategory',
        'updateCategory',
        'deleteCategory',
      ]),

      ...mapActions('products', [
        'getProducts',
      ]),

      cancel() {
        this.$hideModal();
      },

      existThisCategory(name) {
        return !!this.defaultCategories.find(category => {
          if(this.thisEdit && category.name === this.category.name) return;
          return category.name === name;
        });
      },

      submit() {
        if(this.existThisCategory(this.formData.name)) {
          this.$noty.error('This brand has already exists!');
          return;
        }

        this.formSubmit();
      },

      formSubmit() {
        this.setLoading(true);
        if(this.thisEdit) this.startUpdateCategory();
        else this.startCreateCategory();
      },

      startUpdateCategory() {
        this.updateCategory({
          formData: this.formData,
          id: this.category_id
        })
          .then(() => {
            this.setLoading(false);
            this.$noty.success('Updated!');
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      },

      startCreateCategory() {
        this.createCategory(this.formData)
          .then(() => {
            this.setLoading(false);
            this.$noty.success('Created!');
            this.formReset();
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      },

      checkCategoryBeforeDelete() {
        if(!this.hasProducts()) this.startDeleteCategory();
        else this.$noty.error('You cannot delete a category in which there are products!');
      },

      hasProducts() {
        return this.products.filter(product => product.category_id === this.category_id).length;
      },

      startDeleteCategory() {
        this.setLoading(true);

        this.deleteCategory(this.category_id)
          .then(() => {
            this.$noty.success('Deleted!');
            this.$router.push(this.route('admin-brands'));
          })
          .catch(error => {
            this.setLoading(false);
            this.$noty.error(error.message);
          });
      }
    },

    computed: {
      ...mapState('categories', [
        'categories',
        'categories_loading',
      ]),

      ...mapState('products', [
        'products',
      ])
    },

    created() {
      if(!this.thisEdit) {
        this.formData = JSON.parse(JSON.stringify(defaultProductData));
      }
    },

    mounted() {
      if(!this.categories.length) {
        try {
          this.getCategories();
        }
        catch(error) {
          this.$noty.error(error.message);
        }
      }

      if(!this.products.length) {
        try {
          this.getProducts();
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
      this.$destroyModal();
    },

    components: {
      ValidationProvider,
      ValidationObserver,
      Modal,
    }
  }
</script>

<style scoped>

</style>
