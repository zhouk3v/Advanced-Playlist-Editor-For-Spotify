class Create {
  constructor(term) {
    this.term = term;
  }
  toString() {
    return `create playlist ${this.term.toString()}`;
  }
}

export default Create;
