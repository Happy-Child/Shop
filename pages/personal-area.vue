<template>
  <div class="personal">
    <h2>Personal area</h2>

    <div class="row">
      <areaSidebar
        @changeTab="changeTab"
        :cur-tab="curTab"
      />

      <areaContent
        :cur-tab="curTab"
      />
    </div>
  </div>
</template>

<script>
  import AreaSidebar from "../components/site/pages/personal-area/Sidebar";
  import AreaContent from "../components/site/pages/personal-area/Content";

  export default {
    name: "personal-area",

    middleware: ['check-auth'],

    data() {
      return {
        curTab: 'user-data'
      }
    },

    methods: {
      changeTab(tab) {
        this.curTab = tab;
      }
    },

    components: {
      AreaSidebar,
      AreaContent
    }
  }
</script>

<style scoped>

</style>
