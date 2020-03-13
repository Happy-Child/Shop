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
    splitPages(items) {
      this.pagesArray = _.chunk(items, this.itemsPerPage);
      this.setPage();
    },
    
    setPage() {
      if(this.pagesArray.length < this.curPage) {
        this.paginationHandler(1);
        return;
      }
      
      let resultItems = this.pagesArray[this.curPage - 1];
      this.pagesResult = resultItems;
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
