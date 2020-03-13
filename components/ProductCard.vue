<template>
  <div class="card">
    <div class="card-image">
      <img v-if="product.imageSrc" :src="product.imageSrc">
      <img v-else src="~assets/images/default_product_image.svg" alt="">
    </div>

    <div class="card-stacked">
      <div class="card-content">
        <span class="card-title">{{ product.name }}</span>

        <ul class="card__info">
          <li class="card__info-item">
            <span>Brand:</span>
            <span>{{ getCategoryName() }}</span>
          </li>

          <li class="card__info-item">
            <span>Weight:</span>
            <span>{{ product.weight }}kg</span>
          </li>

          <li class="card__info-item">
            <span>Target:</span>
            <span>{{ product.target ? product.target : '-' }}</span>
          </li>

          <li class="card__info-item">
            <span>Price:</span>
            <span>{{ product.price }}$</span>
          </li>
        </ul>
      </div>

      <div class="card-action">
        <slot name="btns">
          <template v-if="cartMode">
            <numeric-input
              :min="1"
              align="center"
              v-model="quantity"
            ></numeric-input>

            <button
              @click.prevent="startRemoveProduct(product.id)"
              class="waves-effect waves-light btn red darken-1"
            >
              <i class="material-icons left">delete_forever</i>
              Remove
            </button>
          </template>

          <template v-else>
            <button
              @click.prevent="addToCart"
              class="waves-effect waves-light btn"
            >
              <i class="material-icons left">add_shopping_cart</i>
              Add to cart
            </button>
          </template>
        </slot>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import NumericInput from "./NumericInput";

  export default {
    name: "ProductCard",

    props: {
      large: {
        type: Boolean,
        default: false
      },
      product: {
        type: Object,
        required: true
      },
      cartMode: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      ...mapActions('cart', [
        'addProduct',
        'removeProduct',
        'changeCounterProduct'
      ]),

      startRemoveProduct(id) {
        this.removeProduct(id);
      },

      addToCart() {
        this.addProduct(JSON.parse(JSON.stringify(this.product)));
      },

      getCategoryName() {
        const id = this.product.category_id;

        if(id) {
          const category = this.$store.getters['categories/getCategoryById'](id);
          return category ? category.name : '';
        }
      }
    },

    computed: {
      quantity: {
        get() {
          return this.product.quantity;
        },
        set(value) {
          this.changeCounterProduct({
            id: this.product.id,
            quantity: value
          })
        }
      }
    },

    components: {
      NumericInput
    }
  }
</script>

<style scoped>

  .card {
    height: 100%;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
  }

  .card-stacked {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card__info-item span:last-child {
    text-align: right;
    padding-left: 10px;
  }

  .card-image img {
    height: 220px;
    object-fit: cover;
    object-position: center;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }

  .card-content {
    padding-bottom: 0;
  }

  .card__info {

  }

  .card__info-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: .5rem;
  }

  .card__info-item:last-child {
    margin-bottom: 0;
  }

  .card__info-item:last-child span:last-child {
    font-weight: bold;
  }

  .card__info-item span,
  .card-title {
    font-weight: bold;
  }

  .card__info-item span:last-child {
    font-weight: 400;
  }

  .card-title {
    font-size: 20px !important;
    line-height: 1.3 !important;
  }

  .card-action button {
    width: 100%;
  }

  .card_large {
    display: flex;
    align-items: flex-start;
    min-height: 220px;
  }

  .card_large .card-image {
    width: 100%;
    max-width: 300px;
    min-height: 100%;
  }

  .card_large .card-image img {
    min-height: 100%;
  }

</style>
