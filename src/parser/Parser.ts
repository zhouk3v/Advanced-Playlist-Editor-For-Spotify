// TODO: overhaul error throwing - make it so that the parser is the only one that throws errors
import Lexer from "./Lexer";
import Add from "./AST/QueryTypes/Add";
import AndExpr from "./AST/Conditions/SecondaryConditions/Exprs/AndExpr";
import BaseCondition from "./AST/Conditions/SecondaryConditions/Exprs/BaseCondition";
import Create from "./AST/QueryTypes/Create";
import Drop from "./AST/QueryTypes/Drop";
import DeleteTrack from "./AST/QueryTypes/DeleteTrack";
import Get from "./AST/QueryTypes/Get";
import NotExpr from "./AST/Conditions/SecondaryConditions/Exprs/NotExpr";
import OrExpr from "./AST/Conditions/SecondaryConditions/Exprs/OrExpr";
import { Expr } from "./AST/Conditions/SecondaryConditions/Exprs/Expr";
import PrimaryConditions, {
  PrimaryCondition,
} from "./AST/Conditions/PrimaryConditions/PrimaryConditions";
import ArtistSearch from "./AST/QueryTypes/Search/ArtistSearch";
import AlbumSearch from "./AST/QueryTypes/Search/AlbumSearch";
import TrackSearch from "./AST/QueryTypes/Search/TrackSearch";
import SecondaryConditions from "./AST/Conditions/SecondaryConditions/SecondaryCondition";
import EqualsRHS from "./AST/Conditions/SecondaryConditions/Exprs/BaseConditionsRHS/EqualsRHS";
import InRHS from "./AST/Conditions/SecondaryConditions/Exprs/BaseConditionsRHS/InRHS";
import LikeRHS from "./AST/Conditions/SecondaryConditions/Exprs/BaseConditionsRHS/LikeRHS";
import { QueryType } from "./AST/QueryTypes/QueryType";
import Search from "./AST/QueryTypes/Search/Search";
import { AlbumSearchObject } from "./AST/Conditions/SearchObjects/AlbumSearchObject";
import {
  TrackSearchObject,
  TrackSearchRHS,
} from "./AST/Conditions/SearchObjects/TrackSearchObject";
import { BaseConditionRHS } from "./AST/Conditions/SecondaryConditions/Exprs/BaseConditionsRHS/BaseConditionRHS";

class Parser {
  lexer: Lexer;
  constructor() {
    this.lexer = new Lexer();
  }

  parseInput(input: string): QueryType {
    this.lexer.tokenize(input);
    return this.query();
  }

  //
  // query rules
  //

  query(): QueryType {
    let query: QueryType;
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
    } else if (this.lexer.inspect("drop")) {
      this.lexer.consume("drop");
      this.lexer.consume("playlist");
      query = this.drop();
    } else {
      throw new Error("Invalid query");
    }
    this.lexer.consumeEOF();
    return query;
  }

  get(): Get {
    const primary = this.primaryconditions();
    const secondary = this.secondaryconditions();
    return new Get(primary, secondary);
  }

  add(): Add {
    const playlist = this.term();
    this.lexer.consume("from");
    const primary = this.primaryconditions();
    const secondary = this.secondaryconditions();
    return new Add(playlist, primary, secondary);
  }

  delete(): DeleteTrack {
    this.lexer.consume("from");
    const playlist = this.term();
    const secondary = this.secondaryconditions();
    return new DeleteTrack(playlist, secondary);
  }

  search(): Search {
    return this.searchRHS();
  }

  create(): Create {
    const playlist = this.term();
    return new Create(playlist);
  }

  drop(): Drop {
    const playlist = this.term();
    return new Drop(playlist);
  }

  //
  // SearchRHS
  //
  searchRHS(): Search {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
      return this.searchArtist();
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
      return this.searchAlbum();
    } else if (this.lexer.inspect("track")) {
      this.lexer.consume("track");
      return this.searchTrack();
    } else {
      throw new Error(
        'Invalid Search type, expecting "artist", "album" or "track"'
      );
    }
  }

  searchArtist(): ArtistSearch {
    const artist = this.term();
    return new ArtistSearch(artist);
  }

  searchAlbum(): AlbumSearch {
    const album = this.term();
    return new AlbumSearch(album);
  }

  searchTrack(): TrackSearch {
    const track = this.term();
    return new TrackSearch(track);
  }

  //
  // Primary condition rules
  //

  primaryconditions(): PrimaryConditions {
    const primary = new PrimaryConditions();
    primary.addConditions(this.primarycondition());
    while (this.lexer.inspect("union")) {
      this.lexer.consume("union");
      primary.addConditions(this.primarycondition());
    }
    return primary;
  }

  primarycondition(): Array<PrimaryCondition> {
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
      throw new Error(
        'Invalid primary condition, expecting "artist", "album", "track", or "playlist"'
      );
    }
  }

  // primary condition - album rules

  albumPrimary(): Array<PrimaryCondition> {
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
    } else {
      throw new Error(
        'Invalid album primary condition, expected a term or "[" here'
      );
    }
    return albumObjs;
  }

  albumTerms(): Array<AlbumSearchObject> {
    const terms = [];
    terms.push(this.albumTerm());
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      terms.push(this.albumTerm());
    }
    return terms;
  }

  albumTerm(): AlbumSearchObject {
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

  artistPrimary(): Array<PrimaryCondition> {
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
    } else {
      throw new Error(
        'Invalid artist primary condition, expected a term or "[" here'
      );
    }
    return artistObjs;
  }

  // primary condition - playlist rules

  playlistPrimary(): Array<PrimaryCondition> {
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
    } else {
      throw new Error(
        'Invalid playlist primary condition, expected a term or "[" here'
      );
    }
    return playlistObjs;
  }

  // primary conditon - track rules

  trackPrimary(): Array<PrimaryCondition> {
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
    } else {
      throw new Error(
        'Invalid track primary condition, expected a term or "[" here'
      );
    }
    return trackObjs;
  }

  trackTerms(): Array<TrackSearchObject> {
    const terms = [];
    terms.push(this.trackTerm());
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      terms.push(this.trackTerm());
    }
    return terms;
  }

  trackTerm(): TrackSearchObject {
    const name = this.term();
    this.lexer.consume("-");
    const trackProps = this.trackTermRHS();
    return {
      name,
      ...trackProps,
    };
  }

  trackTermRHS(): TrackSearchRHS {
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
    } else {
      throw new Error('Invalid track term, expected "artist" or "album" here');
    }
  }

  //
  // secondary condition rules
  //

  secondaryconditions(): SecondaryConditions | null {
    if (this.lexer.inspect("where")) {
      this.lexer.consume("where");
      const expr = this.orTerm();
      return new SecondaryConditions(expr);
    } else {
      return null;
    }
  }

  // Secondary conditions - boolean operators

  orTerm(): Expr {
    let expr = this.andTerm();
    if (this.lexer.inspect("or")) {
      this.lexer.consume("or");
      expr = new OrExpr(expr, this.orTerm());
    }
    return expr;
  }

  andTerm(): Expr {
    let expr = this.notTerm();
    if (this.lexer.inspect("and")) {
      this.lexer.consume("and");
      expr = new AndExpr(expr, this.andTerm());
    }
    return expr;
  }

  notTerm(): Expr {
    if (this.lexer.inspect("not")) {
      this.lexer.consume("not");
      return new NotExpr(this.notTerm());
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

  condition(): BaseCondition {
    const keyword = this.keyword();
    const rhs = this.conditionRHS();
    return new BaseCondition(keyword, rhs);
  }

  conditionRHS(): BaseConditionRHS {
    if (this.lexer.inspect("=")) {
      this.lexer.consume("=");
      const term = this.term();
      return new EqualsRHS(term);
    } else if (this.lexer.inspect("in")) {
      this.lexer.consume("in");
      this.lexer.consume("(");
      const terms = this.terms();
      this.lexer.consume(")");
      return new InRHS(terms);
    } else if (this.lexer.inspect("like")) {
      this.lexer.consume("like");
      const term = this.term();
      return new LikeRHS(term);
    } else {
      throw new Error("Invalid condition RHS");
    }
  }

  // TODO: create type for keywords
  keyword(): string {
    if (this.lexer.inspect("artist")) {
      return this.lexer.consume("artist");
    } else if (this.lexer.inspect("album")) {
      return this.lexer.consume("album");
    } else if (this.lexer.inspect("track")) {
      return this.lexer.consume("track");
    } else {
      throw new Error("Invalid secondary condition LHS");
    }
  }

  terms(): Array<string> {
    const termsArr = [];
    termsArr.push(this.term());
    while (this.lexer.inspect(",")) {
      this.lexer.consume(",");
      termsArr.push(this.term());
    }
    return termsArr;
  }

  term(): string {
    if (this.lexer.inspectTerm()) {
      return this.lexer.consumeTerm();
    } else {
      throw new Error("Invalid term");
    }
  }
}

export default Parser;
