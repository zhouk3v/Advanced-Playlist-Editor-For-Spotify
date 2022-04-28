// TODO: overhaul error throwing
import { EQUALS_CONDITION, IN_CONDITION, REGEX_CONDITION } from "./config";
import lexer from "./lexer";
import add from "./AST/Add";
import andExpr from "./AST/AndExpr";
import baseCondition from "./AST/BaseCondition";
import create from "./AST/Create";
import deleteplaylist from "./AST/DeletePlaylist";
import deletetrack from "./AST/DeleteTrack";
import get from "./AST/Get";
import notExpr from "./AST/NotExpr";
import orExpr from "./AST/OrExpr";
import primarycondition from "./AST/PrimaryCondition";
import search from "./AST/Search";
import secondaryconditions from "./AST/SecondaryCondition";

class Recognizer {
  constructor() {
    this.lexer = new lexer();
  }

  parseInput(input) {
    this.lexer.tokenize(input);
    return this.query();
  }

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
    console.log(query);
    console.log(query.toString());
    return query;
  }

  get() {
    const primary = this.primarycondition();
    const secondary = this.secondaryconditions();
    return new get(primary, secondary);
  }

  add() {
    const playlist = this.term();
    this.lexer.consume("from");
    const primary = this.primarycondition();
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

  primarycondition() {
    const primary = new primarycondition();
    const keyword = this.primarykeyword();
    this.lexer.consume(":");
    const terms = this.primaryconditionRHS();
    primary.addCondition(keyword, terms);
    while (this.lexer.inspect("union")) {
      this.lexer.consume("union");
      const unionKeyword = this.primarykeyword();
      this.lexer.consume(":");
      const unionTerms = this.primaryconditionRHS();
      primary.addCondition(unionKeyword, unionTerms);
    }
    return primary;
  }

  primarykeyword() {
    if (this.lexer.inspect("artist")) {
      return this.lexer.consume("artist");
    } else if (this.lexer.inspect("album")) {
      return this.lexer.consume("album");
    } else if (this.lexer.inspect("track")) {
      return this.lexer.consume("track");
    } else if (this.lexer.inspect("playlist")) {
      return this.lexer.consume("playlist");
    } else {
      throw new Error("Invalid primary condition LHS");
    }
  }

  primaryconditionRHS() {
    let terms = [];
    if (this.lexer.inspectTerm()) {
      const term = this.term();
      terms.push(term);
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      const toAppend = this.terms();
      terms = terms.concat(toAppend);
      this.lexer.consume("]");
    } else {
      throw new Error("Invalid primary condition RHS");
    }
    return terms;
  }

  secondaryconditions() {
    if (this.lexer.inspect("where")) {
      this.lexer.consume("where");
      const expr = this.orTerm();
      return new secondaryconditions(expr);
    } else {
      return null;
    }
  }

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

  condition() {
    const keyword = this.keyword();
    const rhs = this.conditionRHS();
    return new baseCondition(keyword, rhs);
  }

  conditionRHS() {
    if (this.lexer.inspect("=")) {
      this.lexer.consume("=");
      const term = this.term();
      return {
        type: EQUALS_CONDITION,
        term: term,
      };
    } else if (this.lexer.inspect("in")) {
      this.lexer.consume("in");
      this.lexer.consume("(");
      const terms = this.terms();
      this.lexer.consume(")");
      return {
        type: IN_CONDITION,
        term: terms,
      };
    } else if (this.lexer.inspect("like")) {
      this.lexer.consume("like");
      const term = this.term();
      return {
        type: REGEX_CONDITION,
        term: term,
      };
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

export default Recognizer;
