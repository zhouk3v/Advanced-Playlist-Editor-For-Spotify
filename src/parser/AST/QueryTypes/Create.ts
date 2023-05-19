import { createPlaylist } from "../../../API/playlists";
import { QueryType, QueryResult } from "./QueryType";

class Create extends QueryType {
  term: string;
  constructor(term: string) {
    super("Create");
    this.term = term;
  }
  async execute(): Promise<QueryResult> {
    await createPlaylist(this.term);
    return { result: `Created playlist "${this.term}"` };
  }
}

export default Create;
