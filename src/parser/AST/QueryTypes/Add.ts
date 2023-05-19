import { editPlaylist } from "../../../API/playlists";
import { getAllTracksFromPlaylist } from "../../../API/fetchTracks";
import { ADD } from "../../config";
import { QueryType, QueryResult } from "./QueryType";
import PrimaryConditions from "../Conditions/PrimaryConditions";
import SecondaryConditions from "../Conditions/SecondaryCondition";

class Add extends QueryType {
  playlist: string;
  primary: PrimaryConditions;
  secondary: SecondaryConditions | null;
  constructor(
    playlist: string,
    primary: PrimaryConditions,
    secondary: SecondaryConditions | null
  ) {
    super("Add");
    this.playlist = playlist;
    this.primary = primary;
    this.secondary = secondary;
  }
  async execute(): Promise<QueryResult> {
    const unfilteredTracks = await this.primary.getTracks();
    if (this.secondary === null) {
      await editPlaylist(this.playlist, unfilteredTracks, ADD);
    } else {
      const filteredTracks = unfilteredTracks.filter((track) =>
        this.secondary?.evaluate(track)
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
