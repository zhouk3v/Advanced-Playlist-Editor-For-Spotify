class Add {
  constructor(playlist, primary, secondary) {
    this.playlist = playlist;
    this.primary = primary;
    this.secondary = secondary;
  }
  toString() {
    return `add to ${this.playlist.toString()} from ${this.primary.toString()} ${this.secondary.toString()}`;
  }
}

export default Add;
