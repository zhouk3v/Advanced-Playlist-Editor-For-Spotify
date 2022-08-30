import {
  getFirstPageOfPlaylist,
  getAllTracksFromPlaylist,
} from "../../../API/fetchTracks";
import { editPlaylist } from "../../../API/playlists";
import { DELETE } from "../../config";

class DeleteTrack {
  constructor(playlist, secondary) {
    this.type = "DeleteTrack";
    this.playlist = playlist;
    this.secondary = secondary;
  }
  async execute() {
    const tracks = await getAllTracksFromPlaylist(this.playlist);
    if (!this.secondary) {
      await editPlaylist(this.playlist, tracks, DELETE);
    } else {
      const toDelete = tracks.filter((track) => this.secondary.evaluate(track));
      await editPlaylist(this.playlist, toDelete, DELETE);
    }
    const remaining = await getFirstPageOfPlaylist(this.playlist);
    return remaining;
  }
}

export default DeleteTrack;
