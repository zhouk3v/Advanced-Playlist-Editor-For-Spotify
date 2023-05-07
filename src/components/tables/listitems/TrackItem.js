import React from "react";
import "./css/TrackItem.css";

const ArtistLinks = ({ artists, style }) => {
  return (
    <td className="artist" style={style}>
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
  return (
    <>
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
    </>
  );
};
