import React from "react";
import "./css/trackItem.css";

export const TrackItem = ({ index, trackName, albumName, artistName }) => {
  return (
    <tr className="track">
      <td className="index">{index}</td>
      <td className="name">{trackName}</td>
      <td className="album">{albumName}</td>
      <td className="artist">{artistName}</td>
    </tr>
  );
};
