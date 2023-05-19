import { getJSON } from "../../../../API/api";
import { QueryType } from "../QueryType";

interface AlbumSearchResult {
  items: Array<SpotifyApi.AlbumObjectSimplified>;
  url: string | null;
}

class AlbumSearch extends QueryType<AlbumSearchResult> {
  term: string;
  constructor(term: string) {
    super("albumSearch");
    this.term = term;
  }
  async execute(): Promise<AlbumSearchResult> {
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
      items: keywordResults.items,
      url: keywordResults.next,
    };
  }
}

export default AlbumSearch;
