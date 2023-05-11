//TODO: add renew token function

export const CLIENT_ID = "c55715b0bcae4293b92804f55b94c15c";

export const storeToken = (json) => {
  // Store the time that we get the access token
  localStorage.setItem("tokenObtainTime", Date.now());

  // Store the access token, refresh token and expiry time into local storage
  localStorage.setItem("accesstoken", json.access_token);
  localStorage.setItem("refreshtoken", json.refresh_token);
  localStorage.setItem("expiresin", json.expires_in);
};

export const generateRefreshToken = async () => {
  const refresh_token = localStorage.getItem("refreshtoken");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  const json = await res.json();
  storeToken(json);
  return json.access_token;
};

export const getToken = async () => {
  const token = localStorage.getItem("accesstoken");
  const tokenObtainTime = parseInt(localStorage.getItem("tokenObtainTime"));
  const expires_in_sec = parseInt(localStorage.getItem("expiresin")) * 1000;
  if (Date.now() > tokenObtainTime + expires_in_sec) {
    const newToken = await generateRefreshToken();
    return newToken;
  }
  return token;
};

export const getJSON = async (url) => {
  const token = await getToken();
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
