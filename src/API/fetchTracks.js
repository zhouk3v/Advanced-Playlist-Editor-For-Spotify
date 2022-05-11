const callAPI = async (url) => {
  const token = localStorage.getItem("accesstoken");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  return json;
};

export const getTracksFromArtist = async (artist) => {
  const tracks = [];
  // Search for the artist by name in the api
  const searchUrl = new URL("https://api.spotify.com/v1/search");
  searchUrl.search = new URLSearchParams({ q: artist, type: "artist" });
  const searchJson = await callAPI(searchUrl);
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
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single`
  );
  // Fetch the artist's albums, 20 albums at a time (since this is the max limit to the get several albums endpoint)
  do {
    // Fetch the first page of the artist's album
    const albumIds = [];
    const artistAlbums = await callAPI(artistAlbumsUrl);
    // Grab the album ids for use in later API calls
    artistAlbums.items.forEach((album) => {
      albumIds.push(album.id);
    });
    // get the tracks of each album
    const getSeveralAlbumsUrl = new URL(
      `	https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`
    );
    const getSeveralAlbums = await callAPI(getSeveralAlbumsUrl);
    // Go through each album, grab all the tracks from each album
    getSeveralAlbums.albums.forEach((album) => {
      album.tracks.items.forEach((track) =>
        tracks.push({ ...track, album: album })
      );
    });
    // Grab the url of the next page of albums
    artistAlbumsUrl = artistAlbums.next;
  } while (artistAlbumsUrl);
  console.log(tracks);
  return tracks;
};

export const getTracksFromAlbums = async (albums) => {
  const tracks = [];
  // search for each album to get their ids
  const albumIds = [];
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    const searchUrl = new URL("https://api.spotify.com/v1/search");
    searchUrl.search = new URLSearchParams({
      q: `${album.name} artist:${album.artist}`,
      type: "album",
    });
    const searchResults = await callAPI(searchUrl);
    // Search the results with the matching name and artist (it is not a guarantee that the desired album is the first result, but it should be in the first 50)
    const albumObj = searchResults.albums.items.find(
      (curr) =>
        curr.name === album.name &&
        curr.artists.find((artist) => artist.name === album.artist)
    );
    albumIds.push(albumObj.id);
  }
  // Use the get several albums endpoint to get the tracks for the album
  const getSeveralAlbumsUrl = new URL(
    `	https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`
  );
  const getSeveralAlbums = await callAPI(getSeveralAlbumsUrl);
  // Go through each album, grab all the tracks from each album
  getSeveralAlbums.albums.forEach((album) => {
    album.tracks.items.forEach((track) =>
      tracks.push({ ...track, album: album })
    );
  });
  console.log(tracks);
  return tracks;
};

export const getTracksFromPlaylist = async (playlist) => {};

export const getTrack = async (track, filterType, filter) => {};
