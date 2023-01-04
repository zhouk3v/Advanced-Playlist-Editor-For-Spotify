//TODO: relax case sensitivity when checking names
import { getJSON } from "./api";
import { splitIntoChunks } from "./util";
import localforage from "localforage";

export const getTracksFromArtist = async (artist) => {
  // Fetch the artist's tracks from cache first
  // TODO: Refactor to cache albums too
  const cachedTracks = await localforage.getItem(`artist-${artist}`);
  if (cachedTracks) {
    return cachedTracks;
  }
  const tracks = [];
  // Search for the artist by name in the api
  const searchUrl = new URL("https://api.spotify.com/v1/search");
  searchUrl.search = new URLSearchParams({ q: artist, type: "artist" });
  const searchJson = await getJSON(searchUrl);
  // guard clause to check if the first result matches the passed in artist
  if (
    searchJson.artists.items.length === 0 &&
    searchJson.artists.items[0].name !== artist
  ) {
    return tracks;
  }
  // If the names match, start fetching albums and tracks
  const artistObj = searchJson.artists.items[0];
  const artistId = artistObj.id;
  // get the artist albums id
  let artistAlbumsUrl = new URL(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation`
  );
  // Fetch the artist's albums, 20 albums at a time (since this is the max limit to the get several albums endpoint)
  do {
    // Fetch the first page of the artist's album
    const albumIds = [];
    const artistAlbums = await getJSON(artistAlbumsUrl);
    // Grab the album ids for use in later API calls
    artistAlbums.items.forEach((album) => {
      albumIds.push(album.id);
    });
    // get the tracks of each album
    const getSeveralAlbumsUrl = new URL(
      `	https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`
    );
    const getSeveralAlbums = await getJSON(getSeveralAlbumsUrl);
    // Go through each album, grab all the tracks from each album
    getSeveralAlbums.albums.forEach((album) => {
      album.tracks.items.forEach((track) =>
        tracks.push({ ...track, album: album })
      );
    });
    // Grab the url of the next page of albums
    artistAlbumsUrl = artistAlbums.next;
  } while (artistAlbumsUrl);
  await localforage.setItem(`artist-${artist}`, tracks);
  return tracks;
};

export const getTracksFromAlbums = async (albums) => {
  const tracks = [];

  // TODO: Add caching for albums

  // search for each album to get their ids
  const albumIds = [];
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: `${album.name} artist:${album.artist}`,
      type: "album",
      limit: 50,
    });
    const searchResults = await getJSON(searchUrl);
    // Search the results with the matching name and artist (it is not a guarantee that the desired album is the first result, but it should be in the first 50)
    const albumObj = searchResults.albums.items.find(
      (curr) =>
        curr.name === album.name &&
        curr.artists.find((artist) => artist.name === album.artist)
    );
    albumIds.push(albumObj.id);
  }
  // Use the get several albums endpoint to get the tracks for the album (do it 20 albums at a time)
  const albumIdChunks = splitIntoChunks(albumIds, 20);
  for (let i = 0; i < albumIdChunks.length; i++) {
    const chunk = albumIdChunks[i];
    const getSeveralAlbumsUrl = new URL(
      `https://api.spotify.com/v1/albums?ids=${chunk.join(",")}`
    );
    const getSeveralAlbums = await getJSON(getSeveralAlbumsUrl);
    // Go through each album, grab all the tracks from each album
    getSeveralAlbums.albums.forEach((album) => {
      album.tracks.items.forEach((track) =>
        tracks.push({ ...track, album: album })
      );
    });
  }
  return tracks;
};

// Fetch all tracks from playlist
export const getAllTracksFromPlaylist = async (playlistName) => {
  const tracks = [];
  const playlistUrl = new URL("https://api.spotify.com/v1/me/playlists");
  try {
    // Check if the playlist is cached, if so, return the cached playlist
    const cachedPlaylist = await localforage.getItem(
      `playlist-${playlistName}`
    );
    if (cachedPlaylist) {
      return cachedPlaylist;
    }
    // Get the user's saved playlists and search by name
    const playlistRes = await getJSON(playlistUrl);
    const playlistObj = playlistRes.items.find(
      (playlist) => playlist.name === playlistName
    );
    if (!playlistObj) {
      return tracks;
    }
    // Grab the tracks on the playlist, iterating through each page
    let tracksUrl = playlistObj.tracks.href;
    while (tracksUrl) {
      const trackPageJson = await getJSON(tracksUrl);
      trackPageJson.items.forEach((trackObj) => tracks.push(trackObj.track));
      tracksUrl = trackPageJson.next;
    }
    // Cache the result
    await localforage.setItem(`playlist-${playlistName}`, tracks);
    return tracks;
  } catch (e) {
    throw e;
  }
};

// Fetch the first page of tracks from a playlist, this is used in infinite scrolling for the editor
export const getFirstPageOfPlaylist = async (playlistName) => {
  const tracksObject = {
    items: [],
    url: null,
  };
  const playlistUrl = new URL("https://api.spotify.com/v1/me/playlists");
  const playlistRes = await getJSON(playlistUrl);
  const playlistObj = playlistRes.items.find(
    (playlist) => playlist.name === playlistName
  );
  if (!playlistObj) {
    return tracksObject;
  }
  const trackPageJson = await getJSON(playlistObj.tracks.href);
  trackPageJson.items.forEach((trackObj) =>
    tracksObject.items.push(trackObj.track)
  );
  tracksObject.url = trackPageJson.next;
  return tracksObject;
};

export const getTrack = async (track) => {
  // Find the track with the search endpoint
  const searchUrl = new URL("https://api.spotify.com/v1/search");
  searchUrl.search = new URLSearchParams({
    q: `${track.name} ${track.filterType}:${track.filter}`,
    type: "track",
    limit: 50,
  });
  const searchResults = await getJSON(searchUrl);
  const found = searchResults.tracks.items.find((curr) => {
    if (track.filterType === "artist") {
      return curr.name === track.name;
    } else {
      return curr.name === track.name && curr.album.name === track.filter;
    }
  });
  return found;
};
