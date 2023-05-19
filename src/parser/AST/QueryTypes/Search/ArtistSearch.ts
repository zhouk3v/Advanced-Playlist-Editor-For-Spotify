import { getJSON } from "../../../../API/api";
import { QueryType } from "../QueryType";

interface ArtistSearchResult {
  items: Array<SpotifyApi.ArtistObjectFull>;
  url: string | null;
}

class ArtistSearch extends QueryType<ArtistSearchResult> {
  term: string;
  constructor(term: string) {
    super("artistSearch");
    this.term = term;
  }
  async execute(): Promise<ArtistSearchResult> {
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
      items: keywordResults.items,
      url: keywordResults.next,
    };
  }
}

export default ArtistSearch;
