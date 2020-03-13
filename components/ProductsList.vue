<template>

  <section class="products">
    <div class="row">

      <div
        v-for="product in products"
        :class="`col s12 m${12 / lgCount} l${12 / xlCount}`"
      >
        <product-card
          :product="product"
        >
          <template v-if="btnLink" slot="btns">

            <n-link
              :to="route(btnLink.link, {id: product.id})"
              class="waves-effect waves-light btn w-100"
            >
              {{ btnLink.text }}
            </n-link>

          </template>
        </product-card>
      </div>

    </div>
  </section>

</template>

<script>
  import ProductCard from "./ProductCard";

  export default {
    name: "ProductsList",

    props: {
      btnLink: {
        type: Object
      },
      xlCount: {
        type: Number,
        default: 4
      },
      products: {
        type: Array
      },
      lgCount: {
        type: Number,
        default: 3
      },
    },

    components: {
      ProductCard
    }
  }
</script>

<style scoped>

  .col {
    float: none;
    margin: 0 0 1.5rem !important;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
  }

</style>
