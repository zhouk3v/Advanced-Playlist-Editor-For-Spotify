// TODO: overhaul error throwing
// TODO: cleanup primary condition and keyword rules
import lexer from "./lexer";

class Recognizer {
  constructor() {
    this.lexer = new lexer();
  }

  parseInput(input) {
    this.lexer.tokenize(input);
    this.query();
  }

  //
  // query rules
  //

  query() {
    if (this.lexer.inspect("get")) {
      this.lexer.consume("get");
      this.get();
    } else if (this.lexer.inspect("add")) {
      this.lexer.consume("add");
      this.lexer.consume("to");
      this.add();
    } else if (this.lexer.inspect("delete")) {
      this.lexer.consume("delete");
      this.delete();
    } else if (this.lexer.inspect("search")) {
      this.lexer.consume("search");
      this.search();
    } else if (this.lexer.inspect("create")) {
      this.lexer.consume("create");
      this.lexer.consume("playlist");
      this.create();
    } else if (this.lexer.inspect("drop")) {
      this.lexer.consume("drop");
      this.lexer.consume("playlist");
      this.drop();
    } else {
      throw new Error("Invalid query");
    }
    this.lexer.consumeEOF();
  }

  get() {
    this.primaryconditions();
    this.secondaryconditions();
  }

  add() {
    this.term();
    this.lexer.consume("from");
    this.primaryconditions();
    this.secondaryconditions();
  }

  delete() {
    this.lexer.consume("from");
    this.term();
    this.secondaryconditions();
  }

  search() {
    this.searchRHS();
  }

  create() {
    this.term();
  }

  drop() {
    this.term();
  }

  //
  // SearchRHS
  //
  searchRHS() {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
      this.searchArtist();
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
      this.searchAlbum();
    } else if (this.lexer.inspect("track")) {
      this.lexer.consume("track");
      this.searchTrack();
    } else {
      throw new Error(
        'Invalid Search type, expecting "artist", "album" or "track"'
      );
    }
  }

  searchArtist() {
    this.term();
  }

  searchAlbum() {
    this.term();
  }

  searchTrack() {
    this.term();
  }

  //
  // Primary condition rules
  //

  primaryconditions() {
    this.primarycondition();
    while (this.lexer.inspect("union")) {
      this.lexer.consume("union");
      this.primarycondition();
    }
  }

  primarycondition() {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
      this.lexer.consume(":");
      this.artistPrimary();
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
      this.lexer.consume(":");
      this.albumPrimary();
    } else if (this.lexer.inspect("track")) {
      this.lexer.consume("track");
      this.lexer.consume(":");
      this.trackPrimary();
    } else if (this.lexer.inspect("playlist")) {
      this.lexer.consume("playlist");
      this.lexer.consume(":");
      this.playlistPrimary();
    } else {
      throw new Error(
        'Invalid primary condition, expecting "artist", "album", "track", or "playlist"'
      );
    }
  }

  // primary condition - album rules

  albumPrimary() {
    if (this.lexer.inspectTerm()) {
      this.albumTerm();
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      this.albumTerms();
      this.lexer.consume("]");
    } else {
      throw new Error('Expected a term or "[" here');
    }
  }

  albumTerms() {
    this.albumTerm();
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      this.albumTerm();
    }
  }

  albumTerm() {
    this.term();
    this.lexer.consume("-");
    this.lexer.consume("artist");
    this.lexer.consume(":");
    this.term();
  }

  // primary condition - artist rules

  artistPrimary() {
    if (this.lexer.inspectTerm()) {
      this.term();
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      this.terms();
      this.lexer.consume("]");
    } else {
      throw new Error('Expected a term or "[" here');
    }
  }

  // primary condition - playlist rules

  playlistPrimary() {
    if (this.lexer.inspectTerm()) {
      this.term();
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      this.terms();
      this.lexer.consume("]");
    } else {
      throw new Error('Expected a term or "[" here');
    }
  }

  // primary conditon - track rules

  trackPrimary() {
    if (this.lexer.inspectTerm()) {
      this.trackTerm();
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      this.trackTerms();
      this.lexer.consume("]");
    } else {
      throw new Error('Expected a term or "[" here');
    }
  }

  trackTerms() {
    this.trackTerm();
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      this.trackTerm();
    }
  }

  trackTerm() {
    this.term();
    this.lexer.consume("-");
    this.trackTermRHS();
  }

  trackTermRHS() {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
      this.lexer.consume(":");
      this.term();
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
      this.lexer.consume(":");
      this.term();
    } else {
      throw new Error('Expected "artist" or "album" here');
    }
  }

  //
  // secondary condition rules
  //

  secondaryconditions() {
    if (this.lexer.inspect("where")) {
      this.lexer.consume("where");
      this.orTerm();
    }
  }

  // Secondary conditions - boolean operators

  orTerm() {
    this.andTerm();
    if (this.lexer.inspect("or")) {
      this.lexer.consume("or");
      this.orTerm();
    }
  }

  andTerm() {
    this.notTerm();
    if (this.lexer.inspect("and")) {
      this.lexer.consume("and");
      this.andTerm();
    }
  }

  notTerm() {
    if (this.lexer.inspect("not")) {
      this.lexer.consume("not");
      this.notTerm();
    } else if (this.lexer.inspect("(")) {
      this.lexer.consume("(");
      this.orTerm();
      this.lexer.consume(")");
    } else {
      this.condition();
    }
  }

  // Secondary condition - base conditions

  condition() {
    this.keyword();
    this.conditionRHS();
  }

  conditionRHS() {
    if (this.lexer.inspect("=")) {
      this.lexer.consume("=");
      this.term();
    } else if (this.lexer.inspect("in")) {
      this.lexer.consume("in");
      this.lexer.consume("(");
      this.terms();
      this.lexer.consume(")");
    } else if (this.lexer.inspect("like")) {
      this.lexer.consume("like");
      this.term();
    } else {
      throw new Error("Invalid condition RHS");
    }
  }

  keyword() {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
    } else if (this.lexer.inspect("track")) {
      this.lexer.consume("track");
    } else {
      throw new Error("Invalid secondary condition RHS");
    }
  }

  terms() {
    this.term();
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      this.term();
    }
  }

  term() {
    if (this.lexer.inspectTerm()) {
      this.lexer.consumeTerm();
    } else {
      throw new Error("Invalid term");
    }
  }
}

export default Recognizer;
