import { getJSON } from "../../../../API/api";
import { QueryType } from "../QueryType";

interface TrackSearchResult {
  items: Array<SpotifyApi.TrackObjectFull>;
  url: string | null;
}

class TrackSearch extends QueryType<TrackSearchResult> {
  term: string;
  constructor(term: string) {
    super("trackSearch");
    this.term = term;
  }
  async execute(): Promise<TrackSearchResult> {
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
      items: keywordResults.items,
      url: keywordResults.next,
    };
  }
}

export default TrackSearch;
