import { getJSON, getToken } from "./api";

const getPlaylistId = async (playlistName) => {
  const playlistUrl = new URL("https://api.spotify.com/v1/me/playlists");
  const playlistRes = await getJSON(playlistUrl);
  const playlistObj = playlistRes.items.find(
    (playlist) => playlist.name === playlistName
  );
  if (!playlistObj) {
    return null;
  }
  return playlistObj.id;
};

const splitIntoChunks = (arr, chunkSize) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

export const createPlaylist = async (playlist) => {
  const token = getToken();
  // Get the user id through the v1/me endpoint
  const user = await getJSON("https://api.spotify.com/v1/me");
  const userId = user.id;
  // Send a POST request to the user's playlist endpoint to create the playlist
  await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: playlist,
    }),
  });
};

export const deletePlaylists = async (playlist) => {
  const token = getToken();
  const playlistId = await getPlaylistId(playlist);
  if (!playlistId) {
    return;
  }
  // Send a POST request to unfollow the playlist to remove it from the user's list of playlists
  await fetch(`	https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editPlaylist = async (playlist, tracks, methodType) => {
  const token = getToken();
  const playlistId = await getPlaylistId(playlist);
  if (!playlistId) {
    return;
  }
  const uris = [];
  tracks.forEach((track) => {
    uris.push(track.uri);
  });
  const chunks = splitIntoChunks(uris, 100);
  for (let i = 0; i < chunks.length; i++) {
    await fetch(`	https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uris: chunks[i],
      }),
    });
  }
};
