import React from "react";
import "./css/trackItem.css";

export const TrackItem = ({ index, track }) => {
  let artistsNames = track.artists[0].name;
  console.log(track);
  track.artists.forEach((artist, index) => {
    if (index > 0) {
      artistsNames = artistsNames + `, ${artist.name}`;
    }
  });
  return (
    <tr className="track">
      <td className="index">{index}</td>
      <td className="name">
        <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
          {track.name}
        </a>
      </td>
      <td className="album">{track.album.name}</td>
      <td className="artist">{artistsNames}</td>
    </tr>
  );
};
