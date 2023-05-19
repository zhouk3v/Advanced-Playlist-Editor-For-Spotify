import { getJSON } from "../../../../API/api";
import { QueryResult } from "../QueryType";
import Search from "./Search";

class TrackSearch extends Search {
  constructor(term: string) {
    super("TrackSearch", term);
  }
  async execute(): Promise<QueryResult> {
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: this.term,
      type: "track",
    }).toString();
    const results = await getJSON<SpotifyApi.TrackSearchResponse>(
      searchUrl.toString()
    );
    const keywordResults = results.tracks;
    return {
      trackSearchResults: keywordResults.items,
      next: keywordResults.next,
    };
  }
}

export default TrackSearch;
