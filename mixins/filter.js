export default {
  
  data() {
    return {
      workProducts: [],
      maxPrice: null
    }
  },
  
  watch: {
    products: {
      handler(products) {
        if(Array.isArray(products)) {
          this.workProducts = [...products];
        }
      },
      deep: true,
      immediate: true
    },
    
    workProducts: {
      handler(products) {
        if(Array.isArray(products)) {
          this.splitPages(products);
        }
      },
      deep: true,
      immediate: true
    }
  },
  
  methods: {
    weightFormatter(weightList) {
      return weightList.map(item => {
        let result = item.split(" ");
    
        if(result.length > 1) {
          result.splice(1, 1);
        }
    
        return result;
      });
    },
    
    startFilter(formData) {
      let resultFilterArray = [];
    
      resultFilterArray = this.products.filter(product => {
        let search = true;
        if(formData.searchString) {
          const name = product.name.toLowerCase();
          const searchString = formData.searchString.toLowerCase();
          search = name.indexOf(searchString) !== -1;
        }
      
        let categories = true;
        if(formData.categories.length) {
          categories = formData.categories.indexOf(product.category_id) !== -1;
        }
      
        let price = true;
        if(formData.price.length) {
          price = (+product.price >= +formData.price[0]) && (+product.price <= +formData.price[1]);
        }
  
        let weight = true;
        if(formData.weight.length) {
          let weightList = this.weightFormatter(formData.weight);
          const onlyMore = weightList.find(item => item.length === 1);
          
          if(onlyMore) {
            weight = +product.weight >= +onlyMore[0];
          } else {
            let resultWeight = [];
            
            weightList.forEach(item => {
              resultWeight.push(+item[0]);
              resultWeight.push(+item[1]);
            });
            
            resultWeight = [Math.min(...resultWeight), Math.max(...resultWeight)];
            weight = (+product.weight >= +resultWeight[0]) && (+product.weight <= +resultWeight[1]);
          }
        }
      
        return search && categories && price && weight;
      });
    
      resultFilterArray.sort((a, b) => {
        if(formData.sort === 'new') return 0;
        else if(formData.sort === 'price-asc') return a.price - b.price;
        else if(formData.sort === 'price-desc') return b.price - a.price;
      });
    
      this.workProducts = resultFilterArray;
    }
  }
  
}
