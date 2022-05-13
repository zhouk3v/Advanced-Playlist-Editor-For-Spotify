class Get {
  constructor(primary, secondary) {
    this.primary = primary;
    this.secondary = secondary;
  }
  toString() {
    return `get ${this.primary.toString()} ${
      this.secondary ? this.secondary.toString() : ""
    }`;
  }
  async execute() {
    const unfilteredTracks = await this.primary.getTracks();
    if (!this.secondary) {
      console.log(unfilteredTracks);
      return unfilteredTracks;
    }
    const filteredTracks = unfilteredTracks.filter((track) =>
      this.secondary.evaluate(track)
    );
    console.log(filteredTracks);
    return filteredTracks;
  }
}

export default Get;
