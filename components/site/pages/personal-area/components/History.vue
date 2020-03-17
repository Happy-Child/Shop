<template>
  <div class="history">

    <h4 class="personal__content-title">History</h4>

    <div v-if="cart_loading" class="center-box">
      <loading />
    </div>

    <p v-else-if="!pagesResult.length">No orders</p>

    <template v-else>
      <div class="history__list">
        <products-group
          v-for="order in pagesResult"
          :key="order.id"
          :order="order"
        >
          <template v-slot:topText>
            <span class="history__item-date">
              {{ order.date | date }}
            </span>

            <address class="history__item-address">
              {{ order.address }}
            </address>
          </template>
        </products-group>
      </div>

      <vue-paginate
        v-if="pagesArray.length > 1"
        v-model="curPage"
        :page-count="pagesArray.length"
        :prev-text="'<'"
        :next-text="'>'"
        :click-handler="paginationHandler"
        :container-class="'pagination center'"
        :page-class="'waves-effect'"
      ></vue-paginate>
    </template>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ProductsGroup from "../../../components/ProductsGroup";
  import PaginationMixin from '../../../../../mixins/pagination'

  export default {
    name: "History",

    mixins: [PaginationMixin],

    props: {
      orders: {
        type: Array,
        default: []
      }
    },

    data() {
      return {
        itemsPerPage: 3
      }
    },

    watch: {
      orders: {
        handler(orders) {
          if(orders.length) {
            this.splitPages([...orders]);
          }
        },
        deep: true,
        immediate: true
      },
    },

    computed: {
      ...mapState('cart', [
        'cart_loading',
      ])
    },

    components: {
      ProductsGroup
    }
  }
</script>

<style scoped>

</style>
