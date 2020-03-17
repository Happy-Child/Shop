export default {
  
  async asyncData({ store, error }) {
    try {
      let categories = store.state.categories.categories;
      let products = store.state.products.products;
      
      if(!categories.length) {
        await store.dispatch('categories/getCategories');
        categories = store.state.categories.categories;
      }
      
      if(!products.length) {
        await store.dispatch('products/getProducts');
        products = store.state.products.products;
      }
      
      const maxPrice = Math.floor(Math.max(...products.map(item => item.price)));
      
      return {
        categories,
        products,
        maxPrice
      }
    }
    catch(e) {
      error({ statusCode: 400, message: e.message });
    }
  }
  
}
