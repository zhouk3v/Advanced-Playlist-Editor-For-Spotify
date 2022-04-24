// TODO: overhaul error throwing
import lexer from "./lexer";

class Recognizer {
  constructor() {
    this.lexer = new lexer();
  }

  parseInput(input) {
    this.lexer.tokenize(input);
    this.query();
  }

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
    } else {
      throw new Error("Invalid query");
    }
    this.lexer.consumeEOF();
  }

  get() {
    this.primarycondition();
    this.secondaryconditions();
  }

  add() {
    this.term();
    this.lexer.consume("from");
    this.primarycondition();
    this.secondaryconditions();
  }

  delete() {
    this.deleteRHS();
  }

  search() {
    this.keyword();
    this.term();
  }

  create() {
    this.term();
  }

  deleteRHS() {
    if (this.lexer.inspect("from")) {
      this.lexer.consume("from");
      this.term();
      this.secondaryconditions();
    } else if (this.lexer.inspect("playlist")) {
      this.lexer.consume("playlist");
      this.term();
    } else {
      throw new Error("Invalid delete statement");
    }
  }

  primarycondition() {
    this.primarykeyword();
    this.lexer.consume(":");
    this.primaryconditionRHS();
    while (this.lexer.inspect("union")) {
      this.lexer.consume("union");
      this.primarykeyword();
      this.lexer.consume(":");
      this.primaryconditionRHS();
    }
  }

  primarykeyword() {
    if (this.lexer.inspect("artist")) {
      this.lexer.consume("artist");
    } else if (this.lexer.inspect("album")) {
      this.lexer.consume("album");
    } else if (this.lexer.inspect("track")) {
      this.lexer.consume("track");
    } else if (this.lexer.inspect("playlist")) {
      this.lexer.consume("playlist");
    } else {
      throw new Error("Invalid primary condition LHS");
    }
  }

  primaryconditionRHS() {
    if (this.lexer.inspectTerm()) {
      this.term();
    } else if (this.lexer.inspect("[")) {
      this.lexer.consume("[");
      this.terms();
      this.lexer.consume("]");
    } else {
      throw new Error("Invalid primary condition RHS");
    }
  }

  secondaryconditions() {
    if (this.lexer.inspect("where")) {
      this.lexer.consume("where");
      this.orTerm();
    }
  }

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
    } else if (this.lexer.inspect("playlist")) {
      this.lexer.consume("playlist");
    } else {
      throw new Error("Invalid secondary condition LHS");
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
