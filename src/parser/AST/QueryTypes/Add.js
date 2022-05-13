import { addTracksToPlaylist } from "../../../API/playlists";

class Add {
  constructor(playlist, primary, secondary) {
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
      return unfilteredTracks;
    }
    const filteredTracks = unfilteredTracks.filter((track) =>
      this.secondary.evaluate(track)
    );
    await addTracksToPlaylist(this.playlist, filteredTracks);
  }
}

export default Add;
