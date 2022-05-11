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
    const tracks = this.primary.getTracks();
  }
}

export default Get;
