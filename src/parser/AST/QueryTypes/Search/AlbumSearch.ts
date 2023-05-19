import { getJSON } from "../../../../API/api";
import { QueryResult } from "../QueryType";
import Search from "./Search";
class AlbumSearch extends Search {
  constructor(term: string) {
    super("AlbumSearch", term);
  }
  async execute(): Promise<QueryResult> {
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: this.term,
      type: "album",
    }).toString();
    const results = await getJSON<SpotifyApi.AlbumSearchResponse>(
      searchUrl.toString()
    );
    const keywordResults = results.albums;
    return {
      albumSearchResults: keywordResults.items,
      next: keywordResults.next,
    };
  }
}

export default AlbumSearch;
