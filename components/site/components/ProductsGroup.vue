<template>
  <div class="card history__item">

    <div class="history__item-top d-flex align-center justify-between">
      <slot @order="order" name="topText"></slot>

      <span class="history__item-price">
        {{ totalPrice }}$
      </span>
    </div>

    <div
      v-for="product in order.products"
      :key="product.id"
      class="history__item-product d-flex justify-between"
    >

      <div class="history__item-product-left d-flex">
        <div class="history__item-product-image wrap-img">
          <img v-if="product.imageSrc" :src="product.imageSrc">
          <img v-else src="~assets/images/default_product_image.svg" alt="">
        </div>

        <div class="history__item-product-left-text">
          <span class="history__item-product-title">{{ product.name }}</span>
          <span class="history__item-product-count">Count: {{ product.quantity }}</span>
          <span class="history__item-product-count">Price: {{ product.price }}$</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: "ProductsGroup",

    props: {
      order: {
        type: Object,
        required: true
      }
    },

    methods: {

    },

    computed: {
      totalPrice() {
        return this.order.products.reduce((sum, product) => {
          return sum + (product.price * product.quantity);
        }, 0);
      }
    }
  }
</script>

<style lang="sass" scoped>

  .history__item
    padding: 1.2rem

    &-top
      font-size: 1.5rem
      border-bottom: 1px solid rgba(0, 0, 0, .1)
      padding-bottom: 1rem
      margin-bottom: 1rem

    &-address
      margin: 0 auto 0 1rem
      font-size: 16px


    &-product
      margin-bottom: .8rem

      &:last-child
        margin-bottom: 0

      &-image
        max-width: 100px
        height: 100px
        display: flex
        align-items: center
        flex-shrink: 0

        img
          height: 100%


      &-left
        &-text
          padding: .5rem .5rem .5rem 1rem

          & > *
            display: block


      &-title
        font-size: 1.2rem
        font-weight: bold


      &-count
        font-size: 1rem


</style>
