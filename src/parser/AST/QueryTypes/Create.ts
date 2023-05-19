import { createPlaylist } from "../../../API/playlists";
import { QueryType, PlaylistQueryResult } from "./QueryType";

class Create extends QueryType<PlaylistQueryResult> {
  term: string;
  constructor(term: string) {
    super("Create");
    this.term = term;
  }
  async execute(): Promise<PlaylistQueryResult> {
    await createPlaylist(this.term);
    return { result: `Created playlist ${this.term}` };
  }
}

export default Create;
