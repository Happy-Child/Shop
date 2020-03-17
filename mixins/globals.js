import { mapGetters } from "vuex";

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
  
    route(name, params = {}, query = {}) {
      return {name, params, query};
    },
    
    getRouteParam(name) {
      return this.$route.params[name] ? this.$route.params[name] : null;
    },
  
    getRouteQuery(name) {
      return this.$route.query[name] ? this.$route.query[name] : null;
    }
  },
  
  computed: {
    ...mapGetters('users', [
      'isAuth',
      'isAdmin',
      'isDefaultUser',
    ]),
  },
  
  mounted() {
    this.initUserMenu();
  },
  
  beforeDestroy() {
    this.destroyUserMenu();
  },
  
}
