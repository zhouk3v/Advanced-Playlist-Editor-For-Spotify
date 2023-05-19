import { getAllTracksFromPlaylist } from "../../../API/fetchTracks";
import { editPlaylist } from "../../../API/playlists";
import { DELETE } from "../../config";
import SecondaryConditions from "../Conditions/SecondaryCondition";
import { QueryType, TrackQueryResult } from "./QueryType";

class DeleteTrack extends QueryType<TrackQueryResult> {
  playlist: string;
  secondary: SecondaryConditions;
  constructor(playlist: string, secondary: SecondaryConditions) {
    super("DeleteTrack");
    this.playlist = playlist;
    this.secondary = secondary;
  }
  async execute(): Promise<TrackQueryResult> {
    const tracks = await getAllTracksFromPlaylist(this.playlist);
    if (!this.secondary) {
      await editPlaylist(this.playlist, tracks, DELETE);
    } else {
      const toDelete = tracks.filter((track) => this.secondary.evaluate(track));
      await editPlaylist(this.playlist, toDelete, DELETE);
    }
    const remaining = await getAllTracksFromPlaylist(this.playlist);
    return {
      items: remaining,
    };
  }
}

export default DeleteTrack;
