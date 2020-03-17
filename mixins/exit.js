import routesRedirects from './../utils/routes-names-redirect'

export default {
  
  methods: {
    exit() {
      this.logout()
        .then(() => {
          const inAdminPanel = this.$route.path.match(/\/admin\/*/g);
          const inPersonalArea = this.$route.path.match(/\/personal-area\/*/g);
          
          if(inAdminPanel || inPersonalArea) {
            this.$router.push(this.route(routesRedirects.logout));
          }

          this.$noty.info('You are logged out!');
          this.$router.push(this.route(this.$route.name, null, {}));
        })
        .catch(error => {
          this.$noty.error(error.message);
        });
    }
  }
  
}
