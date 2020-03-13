<template>
  <div :id="modalId" :ref="modalId" :class="modalClasses" class="modal">

    <ValidationObserver
      v-slot="{ handleSubmit, validate }"
      ref="observer"
    >
      <form @submit.prevent="handleSubmit(confirm)">

        <div
          :class="bodyClasses"
          class="modal-content"
        >
          <h4>{{ modalTitle }}</h4>
          <slot name="body"></slot>
          <slot name="under-body"></slot>
        </div>

        <div
          :class="footerClasses"
          class="modal-content modals-btns pt-0 d-flex align-center justify-between"
        >
          <slot name="footer">
            <button
              @click.prevent="cancel"
              class="waves-effect center-box waves-light blue-grey darken-4 btn-large"
            >
              {{ btnCancelText }}
            </button>

            <button
              @click="validate()"
              class="waves-effect center-box waves-light green lighten-1 btn-large"
            >
              <loading v-if="loading"/>
              <span v-else>{{ btnConfirmText }}</span>
            </button>
          </slot>
        </div>

      </form>
    </ValidationObserver>

  </div>
</template>

<script>
  import { ValidationObserver } from 'vee-validate';
  import Modals from "../mixins/modals";

  export default {
    name: "Modal",

    mixins: [Modals],

    props: {
      modalId: {
        type: String,
        required: true
      },
      loading: {
        type: Boolean
      },
      modalTitle: {
        type: String,
        default: 'Modal'
      },
      btnCancelText: {
        type: String,
        default: 'Cancel'
      },
      btnConfirmText: {
        type: String,
        default: 'Confirm'
      },
      modalClasses: {
        type: Array
      },
      bodyClasses: {
        type: Array
      },
      footerClasses: {
        type: Array
      },
      closeOnConfirm: {
        type: Boolean,
        default: false
      }
    },

    components: {
      ValidationObserver,
    }
  }
</script>

<style scoped>

  .modal {
    max-width: 500px;
    width: 100%;
  }

  .modals-btns > button {
    width: 100%;
    max-width: calc(50% - 12px);
  }

</style>
