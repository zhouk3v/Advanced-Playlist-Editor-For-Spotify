import { editPlaylist } from "../../../API/playlists";
import { getAllTracksFromPlaylist } from "../../../API/fetchTracks";
import { ADD } from "../../config";
import { QueryType, TrackQueryResult } from "./QueryType";
import PrimaryConditions from "../Conditions/PrimaryConditions";
import SecondaryConditions from "../Conditions/SecondaryCondition";

class Add extends QueryType<TrackQueryResult> {
  playlist: string;
  primary: PrimaryConditions;
  secondary: SecondaryConditions;
  constructor(
    playlist: string,
    primary: PrimaryConditions,
    secondary: SecondaryConditions
  ) {
    super("Add");
    this.playlist = playlist;
    this.primary = primary;
    this.secondary = secondary;
  }
  async execute(): Promise<TrackQueryResult> {
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
    };
  }
}

export default Add;
