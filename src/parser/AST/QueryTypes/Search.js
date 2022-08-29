import { getJSON } from "../../../API/api";

class Search {
  constructor(keyword, term) {
    this.type = "Search";
    this.keyword = keyword;
    this.term = term;
  }
  async execute() {
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: this.term,
      type: this.keyword,
    });
    const results = await getJSON(searchUrl);
    const keywordResults = results[this.keyword + "s"];
    return {
      items: keywordResults.items,
      url: keywordResults.url,
    };
  }
}

export default Search;
