import { getJSON } from "../../../../API/api";
import { QueryResult } from "../QueryType";
import Search from "./Search";
class ArtistSearch extends Search {
  constructor(term: string) {
    super("ArtistSearch", term);
  }
  async execute(): Promise<QueryResult> {
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: this.term,
      type: "artist",
    }).toString();
    const results = await getJSON<SpotifyApi.ArtistSearchResponse>(
      searchUrl.toString()
    );
    const keywordResults = results.artists;
    return {
      artistSearchResults: keywordResults.items,
      next: keywordResults.next,
    };
  }
}

export default ArtistSearch;
