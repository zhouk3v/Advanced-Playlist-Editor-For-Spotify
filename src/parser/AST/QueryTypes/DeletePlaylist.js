import { deletePlaylists } from "../../../API/playlists";

class DeletePlaylist {
  constructor(term) {
    this.type = "DeletePlaylist";
    this.term = term;
  }
  async execute() {
    await deletePlaylists(this.term);
    return `Deleted playlist ${this.term}`;
  }
}

export default DeletePlaylist;
