import { addTracksToPlaylist } from "../../../API/playlists";
import { getTracksFromPlaylist } from "../../../API/fetchTracks";

class Add {
  constructor(playlist, primary, secondary) {
    this.type = "Add";
    this.playlist = playlist;
    this.primary = primary;
    this.secondary = secondary;
  }
  toString() {
    return `add to ${this.playlist.toString()} from ${this.primary.toString()} ${
      this.secondary ? this.secondary.toString() : ""
    }`;
  }
  async execute() {
    const unfilteredTracks = await this.primary.getTracks();
    if (!this.secondary) {
      await addTracksToPlaylist(this.playlist, unfilteredTracks);
    } else {
      const filteredTracks = unfilteredTracks.filter((track) =>
        this.secondary.evaluate(track)
      );
      await addTracksToPlaylist(this.playlist, filteredTracks);
    }
    const newPlaylist = await getTracksFromPlaylist(this.playlist);
    return newPlaylist;
  }
}

export default Add;
