export default {

  data() {
    return {
      userMenuInstance: '',
      loginModalId: 'modal-login',
      regModalId: 'modal-reg',
      resetModalId: 'modal-reset',
      questionModalId: 'modal-question',
    }
  },
  
  methods: {
    initUserMenu() {
      const el = this.$refs.userMenu;
      this.userMenuInstance = M.Dropdown.init(el, {});
    },
  
    destroyUserMenu() {
      if(this.userMenuInstance) this.userMenuInstance.destroy();
    },
  
    route(name, params = {}) {
      return {name, params};
    },
    
    getRouteParam(name) {
      return this.$route.params[name] ? this.$route.params[name] : null;
    },
  
    getRouteQuery(name) {
      return this.$route.query[name] ? this.$route.query[name] : null;
    }
  },
  
  mounted() {
    this.initUserMenu();
  },
  
  beforeDestroy() {
    this.destroyUserMenu();
  },
  
}
