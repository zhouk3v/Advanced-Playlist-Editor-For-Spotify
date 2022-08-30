import { editPlaylist } from "../../../API/playlists";
import { getFirstPageOfPlaylist } from "../../../API/fetchTracks";
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
    const newPlaylist = await getFirstPageOfPlaylist(this.playlist);
    return newPlaylist;
  }
}

export default Add;
