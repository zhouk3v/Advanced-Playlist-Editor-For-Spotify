import { deletePlaylists } from "../../../API/playlists";

class DeletePlaylist {
  constructor(term) {
    this.term = term;
  }
  toString() {
    return `delete playlist ${this.term.toString()}`;
  }
  async execute() {
    await deletePlaylists(this.term);
  }
}

export default DeletePlaylist;
