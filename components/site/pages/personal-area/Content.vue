<template>
  <div class="col s12 m8 l9">
    <div class="personal__content">

      <user-data v-if="curTab === 'user-data'" />
      <history v-else-if="curTab === 'history'" />

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
