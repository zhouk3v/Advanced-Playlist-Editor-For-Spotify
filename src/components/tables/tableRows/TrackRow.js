import React from "react";
import "./css/TrackRow.css";

const ArtistLinks = ({ artists }) => {
  return (
    <td className="artist">
      <a
        key={`${artists[0].name} 0`}
        href={artists[0].external_urls.spotify}
        target="_blank"
        rel="noreferrer"
      >
        {artists[0].name}
      </a>
      {artists.map((artist, index) => {
        return index > 0 ? (
          <span key={`${artist.name} ${index}`}>
            ,{" "}
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noreferrer"
            >
              {artist.name}
            </a>
          </span>
        ) : null;
      })}
    </td>
  );
};

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
      <td className="name">
        <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
          {track.name}
        </a>
      </td>
      <td className="album">
        <a
          href={track.album.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
        >
          {track.album.name}
        </a>
      </td>
      <ArtistLinks artists={track.artists} />
    </tr>
  );
};
