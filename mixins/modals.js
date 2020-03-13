import FormMixins from "./form";

export default {
  
  mixins: [FormMixins],
  
  methods: {
    cancel() {
      this.$emit('cancel');
      this.formReset();
    },
  
    confirm() {
      if(this.closeOnConfirm) this.cancel();
      this.$emit('confirm');
    },
  }
  
}
