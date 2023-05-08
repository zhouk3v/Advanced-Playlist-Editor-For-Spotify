import React, { useEffect, useState } from "react";
import Parser from "../parser/parser";
import QueryResults from "./QueryResults";
import localforage from "localforage";
import "./css/Editor.css";

const Editor = ({ logout }) => {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("");
  const [result, setResult] = useState({
    items: [],
    url: null,
  });
  const [loading, setLoading] = useState(false);

  const parser = new Parser();

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading("Loading");
    const queryAST = parser.parseInput(query);
    const queryResult = await queryAST.execute();
    setLoading("");
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
