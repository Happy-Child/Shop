import Vue from 'vue'

const modalsPlugin = {
  install(Vue) {
    const $hideModal = function () {
      if(window.customCurModal) window.customCurModal.close();
    };
  
    const $showModal = function (modalId) {
      $hideModal();
      const modalEl = document.querySelector(`#${modalId}`);
      window.customCurModal = M.Modal.getInstance(modalEl);
      window.customCurModal.open();
    };
    
    const $destroyModal = function () {
      if(window.customCurModal) window.customCurModal.destroy();
    };
    
    Vue.prototype.$showModal = $showModal;
    Vue.prototype.$hideModal = $hideModal;
    Vue.prototype.$destroyModal = $destroyModal;
  }
};

Vue.use(modalsPlugin);
