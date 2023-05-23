import React, { useEffect, useState } from "react";
import Parser from "../parser/Parser";
import QueryResults from "./QueryResults";
import localforage from "localforage";
import "./css/Editor.css";
import { QueryResult } from "../parser/AST/QueryTypes/QueryType";

interface EditorProps {
  logout: () => Promise<void>;
}

const Editor = (props: EditorProps): JSX.Element => {
  const { logout } = props;
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("");
  const [result, setResult] = useState<QueryResult>({});
  const [loading, setLoading] = useState(false);

  const parser = new Parser();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const queryAST = parser.parseInput(query);
    const queryResult = await queryAST.execute();
    setLoading(false);
    setQueryType(queryAST.type);
    setResult(queryResult);
  };

  useEffect(() => {
    const clearCache = async () => {
      await localforage.clear();
    };
    clearCache();
  }, []);

  return (
    <div className="editor">
      {/* TODO: Seperate header into another component */}
      <div className="header">
        <div>
          <input
            type="checkbox"
            id="enable-duplicates"
            name="enable-duplicates"
          ></input>
          <label>Enable Duplicate Songs in Playlists</label>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <QueryResults type={queryType} results={result}></QueryResults>
      )}
      {/* TODO: Seperate form part into another component */}
      <form className="form" onSubmit={handleSubmit}>
        <textarea className="query-textbox" onChange={handleChange} />
        <div>
          <button className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Editor;
