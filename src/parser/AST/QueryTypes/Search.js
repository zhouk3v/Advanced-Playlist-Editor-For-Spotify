import { getJSON } from "../../../API/api";

class Search {
  constructor(keyword, term) {
    this.type = "Search";
    this.keyword = keyword;
    this.term = term;
  }
  toString() {
    return `search ${this.keyword.toString()} ${this.term.toString()}`;
  }
  async execute() {
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: this.term,
      type: this.keyword,
    });
    const results = await getJSON(searchUrl);
    return results;
  }
}

export default Search;
