import React from "react";
import "./css/trackItem.css";

export const TrackItem = ({ id, index, trackName, albumName, artistName }) => {
  return (
    <div className="track">
      <div className="index">{index}</div>
      <div className="name">{trackName}</div>
      <div className="album">{albumName}</div>
      <div className="artist">{artistName}</div>
    </div>
  );
};
