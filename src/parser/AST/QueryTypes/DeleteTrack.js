import { getTracksFromPlaylist } from "../../../API/fetchTracks";
import { removeTracksFromPlaylists } from "../../../API/playlists";

class DeleteTrack {
  constructor(playlist, secondary) {
    this.playlist = playlist;
    this.secondary = secondary;
  }
  toString() {
    return `delete from ${this.playlist.toString()} ${
      this.secondary ? this.secondary.toString() : ""
    }`;
  }
  async execute() {
    const tracks = await getTracksFromPlaylist(this.playlist);
    if (!this.secondary) {
      await removeTracksFromPlaylists(this.playlist, tracks);
    } else {
      const toDelete = tracks.filter((track) => this.secondary.evaluate(track));
      await removeTracksFromPlaylists(this.playlist, toDelete);
    }
    const remaining = await getTracksFromPlaylist(this.playlist);
    return remaining;
  }
}

export default DeleteTrack;
