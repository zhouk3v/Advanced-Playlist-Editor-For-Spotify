import { QueryType } from "../QueryType";

abstract class Search extends QueryType {
  term: string;
  constructor(type: string, term: string) {
    super(type);
    this.term = term;
  }
}

export default Search;
