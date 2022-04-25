class DeletePlaylist {
  constructor(term) {
    this.term = term;
  }
  toString() {
    return `delete playlist ${this.term.toString()}`;
  }
}

export default DeletePlaylist;
