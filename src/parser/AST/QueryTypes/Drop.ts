import { deletePlaylists } from "../../../API/playlists";
import { QueryType, PlaylistQueryResult } from "./QueryType";

class Drop extends QueryType<PlaylistQueryResult> {
  term: string;
  constructor(term: string) {
    super("DeletePlaylist");
    this.term = term;
  }
  async execute(): Promise<PlaylistQueryResult> {
    await deletePlaylists(this.term);
    return { result: `Deleted playlist ${this.term}` };
  }
}

export default Drop;
