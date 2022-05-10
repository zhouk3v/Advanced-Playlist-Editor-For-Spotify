export const getTracksFromArtist = async (artist) => {
  const token = localStorage.getItem("accesstoken");
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
  const albumIds = [];
  const artistAlbumsUrl = new URL(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single`
  );
  const artistAlbums = await fetch(artistAlbumsUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });
  let artistAlbumsJson = await artistAlbums.json();
  console.log(artistAlbumsJson);
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
  console.log(getSeveralAlbumsJSON);
  getSeveralAlbumsJSON.albums.forEach((album) => {
    album.tracks.items.forEach((track) => tracks.push(track));
  });

  // If there are more albums, fetch them
  // TODO: Wrap this and the above code fetching the first page of albums in a do while loop
  let next = artistAlbumsJson.next;
  while (next) {
    const nextAlbumsIds = [];
    const nextPage = await fetch(next, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const nextPageJson = await nextPage.json();
    nextPageJson.items.forEach((album) => {
      nextAlbumsIds.push(album.id);
    });
    // get the tracks of each album
    const getSeveralAlbumsUrlNext = new URL(
      `	https://api.spotify.com/v1/albums?ids=${nextAlbumsIds.join(",")}`
    );
    const getSeveralAlbumsResponseNext = await fetch(getSeveralAlbumsUrlNext, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
    const getSeveralAlbumsJSONNext = await getSeveralAlbumsResponseNext.json();
    getSeveralAlbumsJSONNext.albums.forEach((album) => {
      // TODO: Consider trimming down on the object that we push to the tracks array, also add the album name of the track
      album.tracks.items.forEach((track) => tracks.push(track));
    });
    next = nextPageJson.next;
  }
  console.log(tracks);
  return tracks;
};

export const getTracksFromAlbum = async (album, artist) => {};

export const getTracksFromPlaylist = async (playlist) => {};

export const getTrack = async (track, filterType, filter) => {};
