class Get {
  constructor(primary, secondary) {
    this.type = "Get";
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
      return unfilteredTracks;
    }
    const filteredTracks = unfilteredTracks.filter((track) =>
      this.secondary.evaluate(track)
    );
    return filteredTracks;
  }
}

export default Get;
