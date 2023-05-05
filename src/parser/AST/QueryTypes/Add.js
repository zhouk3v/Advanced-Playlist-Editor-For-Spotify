import { editPlaylist } from "../../../API/playlists";
import { getAllTracksFromPlaylist } from "../../../API/fetchTracks";
import { ADD } from "../../config";

class Add {
  constructor(playlist, primary, secondary) {
    this.type = "Add";
    this.playlist = playlist;
    this.primary = primary;
    this.secondary = secondary;
  }
  async execute() {
    const unfilteredTracks = await this.primary.getTracks();
    if (!this.secondary) {
      await editPlaylist(this.playlist, unfilteredTracks, ADD);
    } else {
      const filteredTracks = unfilteredTracks.filter((track) =>
        this.secondary.evaluate(track)
      );
      await editPlaylist(this.playlist, filteredTracks, ADD);
    }
    const newPlaylist = await getAllTracksFromPlaylist(this.playlist);
    return {
      items: newPlaylist,
      url: null,
    };
  }
}

export default Add;
