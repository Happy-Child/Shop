export default {
  
  methods: {
    clearFields() {
      for(let key in this.formData) {
        this.formData[key] = null;
      }
    },
    
    formReset() {
      if(!this.formData) {
        this.$emit('resetFormData');
        this.$refs.observer.reset();
      } else {
        this.clearFields();
        this.$refs.observer.reset();
      }
      
      setTimeout(() => {
        M.updateTextFields();
      }, 0);
    }
  }
  
}
