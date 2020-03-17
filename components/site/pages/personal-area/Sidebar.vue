<template>
  <div class="col s12 m4 l3">

    <aside class="personal__sidebar">
      <div class="collection">
        <button
          v-if="!tab.hide"
          v-for="tab in tabs"
          :key="tab.slug"
          @click.prevent="changeTab(tab)"
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
  import { mapActions, mapState } from 'vuex'
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
            slug: 'user-data',
            hide: false,
          },
          {
            name: 'History',
            slug: 'history',
            hide: 'isAdmin',
          }
        ],
        blockTabsForAdmin: [
          'history'
        ]
      }
    },

    watch: {
      user: {
        handler() {
          this.tabs.forEach(tab => {
            tab.hide = this[tab.hide];
          });
        },
        immediate: true
      }
    },

    methods: {
      ...mapActions('users', [
        'logout',
      ]),

      changeTab(tab) {
        const resultTab = tab.hide ? 'user-data' : tab.slug;
        this.$emit('changeTab', resultTab);
      }
    },

    computed: {
      ...mapState('users', [
        'user'
      ])
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
