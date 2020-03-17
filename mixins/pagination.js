export default {
  
  data() {
    return {
      pagesResult: [],
      itemsPerPage: 8,
      pagesArray: [],
      curPage: +this.$route.query.page || 1
    }
  },
  
  watch: {
    curPage() {
      this.setPage();
    }
  },
  
  methods: {
    chunk(items, length) {
      const result = [];
      
      for(let i = 0; i < items.length; i+=length) {
        result.push(items.slice(i, length + i))
      }
      
      return result;
    },
    
    splitPages(items) {
      this.pagesArray = this.chunk(items, this.itemsPerPage);
      this.setPage();
    },
    
    setPage() {
      const pagesLength = this.pagesArray.length;
      
      if(pagesLength && (pagesLength < this.curPage)) {
        this.paginationHandler(1);
        return;
      }
      
      if(pagesLength) {
        this.pagesResult = this.pagesArray[this.curPage - 1];
      } else {
        this.paginationHandler(1);
        this.pagesResult = [];
      }
    },
    
    paginationHandler(page) {
      this.$router.push({
        name: this.$route.name,
        query: { page }
      });
      
      this.curPage = page;
    }
  }
  
}
