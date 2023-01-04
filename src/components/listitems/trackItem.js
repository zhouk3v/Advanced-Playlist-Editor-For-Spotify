import React from "react";
import "./css/trackItem.css";

export const TrackItem = ({ index, track }) => {
  let artistsNames = track.artists[0].name;
  track.artists.forEach((artist, index) => {
    if (index > 0) {
      artistsNames = artistsNames + `, ${artist.name}`;
    }
  });
  return (
    <tr className="track">
      <td className="index">{index}</td>
      <td className="name">{track.name}</td>
      <td className="album">{track.album.name}</td>
      <td className="artist">{artistsNames}</td>
    </tr>
  );
};
