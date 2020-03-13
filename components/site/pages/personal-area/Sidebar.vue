<template>
  <div class="col s12 m4 l3">
    <aside class="personal__sidebar">

      <div class="collection">
        <button
          v-for="tab in tabs"
          :key="tab.slug"
          @click.prevent="changeTab(tab.slug)"
          :class="{'active': curTab === tab.slug}"
          class="collection-item"
        >
          {{ tab.name }}
        </button>

        <button
          @click.prevent="exit"
          class="collection-item"
        >
          Exit
        </button>
      </div>

    </aside>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import Exit from './../../../../mixins/exit';

  export default {
    name: "Sidebar",

    mixins: [Exit],

    props: {
      curTab: {
        type: String
      }
    },

    data() {
      return {
        tabs: [
          {
            name: 'User data',
            slug: 'user-data'
          },
          {
            name: 'History',
            slug: 'history'
          }
        ]
      }
    },

    methods: {
      ...mapActions('users', [
        'logout',
      ]),

      changeTab(tab) {
        this.$emit('changeTab', tab);
      }
    }
  }
</script>

<style scoped>

  .collection-item {
    border: none;
    box-shadow: none;
    width: 100%;
    display: block;
    cursor: pointer;
  }

</style>
