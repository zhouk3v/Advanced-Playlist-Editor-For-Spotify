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
  execute() {
    
  }
}

export default Get;
