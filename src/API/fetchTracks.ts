//TODO: relax case sensitivity when checking names
import { AlbumSearchObject } from "../parser/AST/Conditions/SearchObjects/AlbumSearchObject";
import { TrackSearchObject } from "../parser/AST/Conditions/SearchObjects/TrackSearchObject";
import { getJSON } from "./api";
import { splitIntoChunks } from "./util";
import localforage from "localforage";

export interface TrackObject extends SpotifyApi.TrackObjectSimplified {
  album: SpotifyApi.AlbumObjectSimplified;
}

export const getTracksFromArtist = async (
  artist: string
): Promise<Array<TrackObject>> => {
  // Fetch the artist's tracks from cache first
  // TODO: Refactor to cache albums too
  const cachedTracks = (await localforage.getItem(
    `artist-${artist}`
  )) as Array<TrackObject>;
  if (cachedTracks) {
    return cachedTracks;
  }
  const tracks: Array<TrackObject> = [];
  // Search for the artist by name in the api
  const searchUrl = new URL("https://api.spotify.com/v1/search");
  searchUrl.search = new URLSearchParams({
    q: artist,
    type: "artist",
  }).toString();
  const searchJson = await getJSON<SpotifyApi.ArtistSearchResponse>(
    searchUrl.toString()
  );
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
  let artistAlbumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation`;
  let nextUrl: string | null = null;
  // Fetch the artist's albums, 20 albums at a time (since this is the max limit to the get several albums endpoint)
  do {
    // Fetch the first page of the artist's album
    const albumIds: Array<string> = [];
    const artistAlbums = await getJSON<SpotifyApi.ArtistsAlbumsResponse>(
      artistAlbumsUrl
    );
    // Grab the album ids for use in later API calls
    artistAlbums.items.forEach((album) => {
      albumIds.push(album.id);
    });
    // get the tracks of each album
    const getSeveralAlbumsUrl = `https://api.spotify.com/v1/albums?ids=${albumIds.join(
      ","
    )}`;
    const getSeveralAlbums = await getJSON<SpotifyApi.MultipleAlbumsResponse>(
      getSeveralAlbumsUrl
    );
    // Go through each album, grab all the tracks from each album
    getSeveralAlbums.albums.forEach((album) => {
      album.tracks.items.forEach((track) =>
        tracks.push({
          ...track,
          album: album,
        })
      );
    });
    nextUrl = artistAlbums.next;
    if (nextUrl) {
      artistAlbumsUrl = nextUrl;
    }
  } while (nextUrl);
  await localforage.setItem(`artist-${artist}`, tracks);
  return tracks;
};

export const getTracksFromAlbums = async (
  albums: Array<AlbumSearchObject>
): Promise<Array<TrackObject>> => {
  const tracks: Array<TrackObject> = [];

  // TODO: Add caching for albums

  // search for each album to get their ids
  const albumIds = [];
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: `${album.name} artist:${album.artist}`,
      type: "album",
      limit: "50",
    }).toString();
    const searchResults = await getJSON<SpotifyApi.SearchResponse>(
      searchUrl.toString()
    );
    // Search the results with the matching name and artist (it is not a guarantee that the desired album is the first result, but it should be in the first 50)
    if (searchResults.albums === undefined) {
      continue;
    }
    const albumObj = searchResults.albums.items.find(
      (curr) =>
        curr.name === album.name &&
        curr.artists.find((artist) => artist.name === album.artist)
    );
    if (albumObj === undefined) {
      continue;
    }
    albumIds.push(albumObj.id);
  }
  // Use the get several albums endpoint to get the tracks for the album (do it 20 albums at a time)
  const albumIdChunks = splitIntoChunks(albumIds, 20);
  for (let i = 0; i < albumIdChunks.length; i++) {
    const chunk = albumIdChunks[i];
    const getSeveralAlbumsUrl = `https://api.spotify.com/v1/albums?ids=${chunk.join(
      ","
    )}`;
    const getSeveralAlbums = await getJSON<SpotifyApi.MultipleAlbumsResponse>(
      getSeveralAlbumsUrl
    );
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
export const getAllTracksFromPlaylist = async (
  playlistName: string
): Promise<Array<TrackObject>> => {
  const cachedPlaylist = (await localforage.getItem(
    `playlist-${playlistName}`
  )) as Array<TrackObject>;
  if (cachedPlaylist) {
    return cachedPlaylist;
  }

  const tracks: Array<TrackObject> = [];
  let playlistUrl = "https://api.spotify.com/v1/me/playlists";
  // Check if the playlist is cached, if so, return the cached playlist

  // Get the user's saved playlists and search by name
  let playlistObj: SpotifyApi.PlaylistObjectSimplified | undefined = undefined;
  let nextPlayliststURL: string | null = null;
  do {
    const playlistRes = await getJSON<
      SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified>
    >(playlistUrl);
    playlistObj = playlistRes.items.find(
      (playlist) => playlist.name === playlistName
    );
    if (playlistObj) {
      break;
    }
    nextPlayliststURL = playlistRes.next;
    if (nextPlayliststURL) {
      playlistUrl = nextPlayliststURL;
    }
  } while (nextPlayliststURL);

  if (playlistObj === undefined) {
    return tracks;
  }
  // Grab the tracks on the playlist, iterating through each page
  let tracksUrl = playlistObj.tracks.href;
  let nextTracksUrl: string | null = null;
  do {
    const trackPageJson = await getJSON<
      SpotifyApi.PagingObject<SpotifyApi.PlaylistTrackObject>
    >(tracksUrl);
    trackPageJson.items.forEach((trackObj) => {
      if (trackObj.track === null) {
        return;
      }
      tracks.push(trackObj.track);
    });
    let nextTracksUrl = trackPageJson.next;
    if (nextTracksUrl) {
      tracksUrl = nextTracksUrl;
    }
  } while (nextTracksUrl);
  // Cache the result
  await localforage.setItem(`playlist-${playlistName}`, tracks);
  return tracks;
};

export const getTrack = async (
  track: TrackSearchObject
): Promise<TrackObject | undefined> => {
  // Find the track with the search endpoint
  const searchUrl = new URL("https://api.spotify.com/v1/search");
  searchUrl.search = new URLSearchParams({
    q: `${track.name} ${track.filterType}:${track.filter}`,
    type: "track",
    limit: "50",
  }).toString();
  const searchResults = await getJSON<SpotifyApi.TrackSearchResponse>(
    searchUrl.toString()
  );
  const found = searchResults.tracks.items.find((curr) => {
    if (track.filterType === "artist") {
      return curr.name === track.name;
    } else {
      return curr.name === track.name && curr.album.name === track.filter;
    }
  });
  return found;
};
