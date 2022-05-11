const token = localStorage.getItem("accesstoken");

export const getTracksFromArtist = async (artist) => {
  const tracks = [];
  // Search for the artist by name in the api
  const searchUrl = new URL("https://api.spotify.com/v1/search");
  searchUrl.search = new URLSearchParams({ q: artist, type: "artist" });
  const searchResults = await fetch(searchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });
  const resultsJson = await searchResults.json();
  // guard clause to check if the first result matches the passed in artist
  if (
    resultsJson.artists.items.length === 0 &&
    resultsJson.artists.items[0].name !== artist
  ) {
    return tracks;
  }
  // If the names match, start fetching albums and tracks
  const artistObj = resultsJson.artists.items[0];
  const artistId = artistObj.id;
  // get the artist albums id
  let artistAlbumsUrl = new URL(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single`
  );
  // Fetch the artist's albums, 20 albums at a time (since this is the max limit to the get several albums endpoint)
  do {
    // Fetch the first page of the artist's album
    const albumIds = [];
    const artistAlbums = await fetch(artistAlbumsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const artistAlbumsJson = await artistAlbums.json();
    // Grab the album ids for use in later API calls
    artistAlbumsJson.items.forEach((album) => {
      albumIds.push(album.id);
    });
    // get the tracks of each album
    const getSeveralAlbumsUrl = new URL(
      `	https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`
    );
    const getSeveralAlbumsResponse = await fetch(getSeveralAlbumsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const getSeveralAlbumsJSON = await getSeveralAlbumsResponse.json();
    // Go through each album, grab all the tracks from each album
    getSeveralAlbumsJSON.albums.forEach((album) => {
      album.tracks.items.forEach((track) =>
        tracks.push({ ...track, album: album })
      );
    });
    artistAlbumsUrl = artistAlbumsJson.next;
  } while (artistAlbumsUrl);
  console.log(tracks);
  return tracks;
};

export const getTracksFromAlbum = async (albums) => {
  const tracks = [];
  // search for the album by name and artist
};

export const getTracksFromPlaylist = async (playlist) => {};

export const getTrack = async (track, filterType, filter) => {};
