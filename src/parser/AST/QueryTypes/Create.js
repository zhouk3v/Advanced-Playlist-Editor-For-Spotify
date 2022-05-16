import { createPlaylist } from "../../../API/playlists";

class Create {
  constructor(term) {
    this.type = "Create";
    this.term = term;
  }
  toString() {
    return `create playlist ${this.term.toString()}`;
  }
  async execute() {
    await createPlaylist(this.term);
    return `Created playlist ${this.term}`;
  }
}

export default Create;
