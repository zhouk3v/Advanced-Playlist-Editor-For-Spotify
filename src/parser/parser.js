// TODO: overhaul error throwing
import { EQUALS_CONDITION, IN_CONDITION, REGEX_CONDITION } from "./config";
import lexer from "./lexer";
import add from "./AST/QueryTypes/Add";
import andExpr from "./AST/SecondaryConditionExprs/AndExpr";
import baseCondition from "./AST/SecondaryConditionExprs/BaseCondition";
import create from "./AST/QueryTypes/Create";
import deleteplaylist from "./AST/QueryTypes/DeletePlaylist";
import deletetrack from "./AST/QueryTypes/DeleteTrack";
import get from "./AST/QueryTypes/Get";
import notExpr from "./AST/SecondaryConditionExprs/NotExpr";
import orExpr from "./AST/SecondaryConditionExprs/OrExpr";
import primaryconditions from "./AST/Conditions/PrimaryConditions";
import search from "./AST/QueryTypes/Search";
import secondaryconditions from "./AST/Conditions/SecondaryCondition";
import equalsRHS from "./AST/SecondaryConditionExprs/BaseConditionsRHS/EqualsRHS";
import inRHS from "./AST/SecondaryConditionExprs/BaseConditionsRHS/InRHS";
import likeRHS from "./AST/SecondaryConditionExprs/BaseConditionsRHS/LikeRHS";

class Parser {
  constructor() {
    this.lexer = new lexer();
  }

  parseInput(input) {
    this.lexer.tokenize(input);
    return this.query();
  }

  //
  // query rules
  //

  query() {
    let query;
    if (this.lexer.inspect("get")) {
      this.lexer.consume("get");
      query = this.get();
    } else if (this.lexer.inspect("add")) {
      this.lexer.consume("add");
      this.lexer.consume("to");
      query = this.add();
    } else if (this.lexer.inspect("delete")) {
      this.lexer.consume("delete");
      query = this.delete();
    } else if (this.lexer.inspect("search")) {
      this.lexer.consume("search");
      query = this.search();
    } else if (this.lexer.inspect("create")) {
      this.lexer.consume("create");
      this.lexer.consume("playlist");
      query = this.create();
    } else {
      throw new Error("Invalid query");
    }
    this.lexer.consumeEOF();
    return query;
  }

  get() {
    const primary = this.primaryconditions();
    const secondary = this.secondaryconditions();
    return new get(primary, secondary);
  }

  add() {
    const playlist = this.term();
    this.lexer.consume("from");
    const primary = this.primaryconditions();
    const secondary = this.secondaryconditions();
    return new add(playlist, primary, secondary);
  }

  delete() {
    return this.deleteRHS();
  }

  search() {
    const keyword = this.keyword();
    const term = this.term();
    return new search(keyword, term);
  }

  create() {
    const playlist = this.term();
    return new create(playlist);
  }

  deleteRHS() {
    if (this.lexer.inspect("from")) {
      this.lexer.consume("from");
      const playlist = this.term();
      const secondary = this.secondaryconditions();
      return new deletetrack(playlist, secondary);
    } else if (this.lexer.inspect("playlist")) {
      this.lexer.consume("playlist");
      const playlist = this.term();
      return new deleteplaylist(playlist);
    } else {
      throw new Error("Invalid delete statement");
    }
  }

  //
  // Primary condition rules
  //

  primaryconditions() {
    const primary = new primaryconditions();
    primary.addConditions(this.primarycondition());
    while (this.lexer.inspect("union")) {
      this.lexer.consume("union");
      primary.addConditions(this.primarycondition());
    }
    return primary;
  }

  primarycondition() {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
      this.lexer.consume(":");
      return this.artistPrimary();
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
      this.lexer.consume(":");
      return this.albumPrimary();
    } else if (this.lexer.inspect("track")) {
      this.lexer.consume("track");
      this.lexer.consume(":");
      return this.trackPrimary();
    } else if (this.lexer.inspect("playlist")) {
      this.lexer.consume("playlist");
      this.lexer.consume(":");
      return this.playlistPrimary();
    } else {
      throw new Error("Invalid primary condition");
    }
  }

  // primary condition - album rules

  albumPrimary() {
    const albumObjs = [];
    if (this.lexer.inspectTerm()) {
      const album = this.albumTerm();
      albumObjs.push({
        type: "album",
        ...album,
      });
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      const albums = this.albumTerms();
      albums.forEach((album) => {
        albumObjs.push({
          type: "album",
          ...album,
        });
      });
      this.lexer.consume("]");
    }
    return albumObjs;
  }

  albumTerms() {
    const terms = [];
    terms.push(this.albumTerm());
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      terms.push(this.albumTerm());
    }
    return terms;
  }

  albumTerm() {
    const name = this.term();
    this.lexer.consume("-");
    this.lexer.consume("artist");
    this.lexer.consume(":");
    const artist = this.term();
    return {
      name,
      artist,
    };
  }

  // primary condition - artist rules

  artistPrimary() {
    const artistObjs = [];
    if (this.lexer.inspectTerm()) {
      const artist = this.term();
      artistObjs.push({
        type: "artist",
        name: artist,
      });
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      const artists = this.terms();
      artists.forEach((artist) => {
        artistObjs.push({
          type: "artist",
          name: artist,
        });
      });
      this.lexer.consume("]");
    }
    return artistObjs;
  }

  // primary condition - playlist rules

  playlistPrimary() {
    const playlistObjs = [];
    if (this.lexer.inspectTerm()) {
      const playlist = this.term();
      playlistObjs.push({
        type: "playlist",
        name: playlist,
      });
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      const playlists = this.terms();
      playlists.forEach((playlist) => {
        playlistObjs.push({
          type: "playlist",
          name: playlist,
        });
      });
      this.lexer.consume("]");
    }
    return playlistObjs;
  }

  // primary conditon - track rules

  trackPrimary() {
    const trackObjs = [];
    if (this.lexer.inspectTerm()) {
      const track = this.trackTerm();
      trackObjs.push({
        type: "track",
        ...track,
      });
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      const tracks = this.trackTerms();
      tracks.forEach((track) => {
        trackObjs.push({
          type: "track",
          ...track,
        });
      });
      this.lexer.consume("]");
    }
    return trackObjs;
  }

  trackTerms() {
    const terms = [];
    terms.push(this.trackTerm());
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      terms.push(this.trackTerm());
    }
    return terms;
  }

  trackTerm() {
    const name = this.term();
    this.lexer.consume("-");
    const trackProps = this.trackTermRHS();
    return {
      name,
      ...trackProps,
    };
  }

  trackTermRHS() {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
      this.lexer.consume(":");
      const artist = this.term();
      return {
        filterType: "artist",
        filter: artist,
      };
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
      this.lexer.consume(":");
      const album = this.term();
      return {
        filterType: "album",
        filter: album,
      };
    }
  }

  //
  // secondary condition rules
  //

  secondaryconditions() {
    if (this.lexer.inspect("where")) {
      this.lexer.consume("where");
      const expr = this.orTerm();
      return new secondaryconditions(expr);
    } else {
      return null;
    }
  }

  // Secondary conditions - boolean operators

  orTerm() {
    let expr = this.andTerm();
    if (this.lexer.inspect("or")) {
      this.lexer.consume("or");
      expr = new orExpr(expr, this.orTerm());
    }
    return expr;
  }

  andTerm() {
    let expr = this.notTerm();
    if (this.lexer.inspect("and")) {
      this.lexer.consume("and");
      expr = new andExpr(expr, this.andTerm());
    }
    return expr;
  }

  notTerm() {
    if (this.lexer.inspect("not")) {
      this.lexer.consume("not");
      return new notExpr(this.notTerm());
    } else if (this.lexer.inspect("(")) {
      this.lexer.consume("(");
      const expr = this.orTerm();
      this.lexer.consume(")");
      return expr;
    } else {
      return this.condition();
    }
  }

  // Secondary condition - base conditions

  condition() {
    const keyword = this.keyword();
    const rhs = this.conditionRHS();
    return new baseCondition(keyword, rhs);
  }

  conditionRHS() {
    if (this.lexer.inspect("=")) {
      this.lexer.consume("=");
      const term = this.term();
      return new equalsRHS(term);
    } else if (this.lexer.inspect("in")) {
      this.lexer.consume("in");
      this.lexer.consume("(");
      const terms = this.terms();
      this.lexer.consume(")");
      return new inRHS(terms);
    } else if (this.lexer.inspect("like")) {
      this.lexer.consume("like");
      const term = this.term();
      return new likeRHS(term);
    } else {
      throw new Error("Invalid condition RHS");
    }
  }

  keyword() {
    if (this.lexer.inspect("artist")) {
      return this.lexer.consume("artist");
    } else if (this.lexer.inspect("album")) {
      return this.lexer.consume("album");
    } else if (this.lexer.inspect("track")) {
      return this.lexer.consume("track");
    } else if (this.lexer.inspect("playlist")) {
      return this.lexer.consume("playlist");
    } else {
      throw new Error("Invalid secondary condition LHS");
    }
  }

  terms() {
    const termsArr = [];
    termsArr.push(this.term());
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      termsArr.push(this.term());
    }
    return termsArr;
  }

  term() {
    if (this.lexer.inspectTerm()) {
      return this.lexer.consumeTerm();
    } else {
      throw new Error("Invalid term");
    }
  }
}

export default Parser;
