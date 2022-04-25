class Search {
  constructor(keyword, term) {
    this.keyword = keyword;
    this.term = term;
  }
  toString() {
    return `search ${this.keyword.toString()} ${this.term.toString()}`;
  }
}

export default Search;
