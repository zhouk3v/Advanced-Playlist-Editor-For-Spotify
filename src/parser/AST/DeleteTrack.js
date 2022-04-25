class DeleteTrack {
  constructor(playlist, secondary) {
    this.playlist = playlist;
    this.secondary = secondary;
  }
  toString() {
    return `delete from ${this.playlist.toString()} ${this.secondary.toString()}`;
  }
}

export default DeleteTrack;
