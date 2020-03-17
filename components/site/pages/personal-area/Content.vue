<template>
  <div class="col s12 m8 l9">
    <div class="personal__content">

      <user-data v-if="curTab === 'user-data'" />
      <history
        v-else-if="!isAdmin && (curTab === 'history')"
        :orders="orders"
      />

    </div>
  </div>
</template>

<script>
  import UserData from "./components/UserData";
  import History from "./components/History";

  export default {
    name: "Content",

    props: {
      curTab: {
        type: String
      },
      orders: {
        type: Array,
        default: []
      }
    },

    components: {
      UserData,
      History,
    }
  }
</script>

<style>

  .personal__content-title {
    margin-top: 0;
  }

</style>
