class Get {
  constructor(primary, secondary) {
    this.type = "Get";
    this.primary = primary;
    this.secondary = secondary;
  }
  async execute() {
    const unfilteredTracks = await this.primary.getTracks();
    if (!this.secondary) {
      return {
        tracks: unfilteredTracks,
        url: null,
      };
    }
    const filteredTracks = unfilteredTracks.filter((track) =>
      this.secondary.evaluate(track)
    );
    return {
      tracks: filteredTracks,
      url: null,
    };
  }
}

export default Get;
