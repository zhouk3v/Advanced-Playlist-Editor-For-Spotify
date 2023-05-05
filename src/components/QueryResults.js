import React from "react";

import "./css/QueryResults.css";
import TracksTable from "./tables/TracksTable";

const QueryResults = ({ type, results }) => {
  // Render the result of a get, add or deletetrack query
  const renderTracksQuery = () => {
    return <TracksTable items={results.items}></TracksTable>;
  };
  // Render the result of a create playlist or delete playlist query
  const renderPlaylistQuery = () => {
    return <div>{results}</div>;
  };
  // Render the result of a search query
  const renderSearchQuery = () => {
    return null;
  };

  switch (type) {
    case "Get":
    case "Add":
    case "DeleteTrack":
      return renderTracksQuery();
    case "Create":
    case "DeletePlaylist":
      return renderPlaylistQuery();
    case "Search":
      return renderSearchQuery();
    default:
      return <div className="default">Waiting for a query</div>;
  }
};

export default QueryResults;
