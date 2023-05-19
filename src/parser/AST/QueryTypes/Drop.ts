import { deletePlaylists } from "../../../API/playlists";
import { QueryType, QueryResult } from "./QueryType";

class Drop extends QueryType {
  term: string;
  constructor(term: string) {
    super("Drop");
    this.term = term;
  }
  async execute(): Promise<QueryResult> {
    await deletePlaylists(this.term);
    return { result: `Dropped playlist "${this.term}"` };
  }
}

export default Drop;
