import { createPlaylist } from "../../../API/playlists";

class Create {
  constructor(term) {
    this.term = term;
  }
  toString() {
    return `create playlist ${this.term.toString()}`;
  }
  async execute() {
    createPlaylist(this.term);
  }
}

export default Create;
