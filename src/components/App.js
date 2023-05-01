import React, { useState, useEffect } from "react";
import crypto from "crypto";
import localforage from "localforage";

import Editor from "./Editor";

const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = "c55715b0bcae4293b92804f55b94c15c";

// local testing Uri
const redirectUri = "http://localhost:3000/";
// production Uri

const scopes = [
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
];

const base64Encode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

// TODO: Move token generation code into API
const storeToken = (json) => {
  // Store the time that we get the access token
  localStorage.setItem("tokenObtainTime", Date.now());

  // Store the access token, refresh token and expiry time into local storage
  localStorage.setItem("accesstoken", json.access_token);
  localStorage.setItem("refreshtoken", json.refresh_token);
  localStorage.setItem("expiresin", json.expires_in);
};

const logout = async () => {
  localStorage.clear();
  await localforage.clear();
  window.location.reload();
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("accesstoken"));
  const [validState, setValidState] = useState(true);
  const [codeChallenge, setCodeChallenge] = useState(null);
  const [urlState, setUrlState] = useState(null);
  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    const generateNewToken = async (code) => {
      // Grab the code verifier from session storage
      const codeVerifier = sessionStorage.getItem("codeVerifier");
      // Send a POST request with the code to get an access token, refresh token and
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      });
      const json = await res.json();
      storeToken(json);
      // Clear the url search params
      window.location.search = "";
      setToken(json.access_token);
    };

    const generateRefreshToken = async () => {
      const refresh_token = localStorage.getItem("refreshtoken");
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "refresh_token",
          refresh_token,
        }),
      });
      const json = await res.json();
      storeToken(json);
      setToken(json.access_token);
    };

    const tokenExists = localStorage.getItem("accesstoken");
    if (!tokenExists) {
      // Get the search parameters, if any from the url
      const params = new URL(window.location).searchParams;
      const code = params.get("code");
      const urlState = params.get("state");
      // If we were redirected from spotify, we should get 2 search parameters: code and state
      if (code && urlState) {
        // Validate the state in the redirectUri
        const savedState = sessionStorage.getItem("state");
        setValidState(urlState === savedState);
        if (validState) {
          setIsRedirect(true);
          generateNewToken(code);
        }
      } else {
        // Generate state and code challenge
        const newUrlState = base64Encode(crypto.randomBytes(30));
        setUrlState(newUrlState);
        sessionStorage.setItem("state", newUrlState); // store our state in session storage so that we can verify it later
        const codeVerifier = base64Encode(crypto.randomBytes(32));
        sessionStorage.setItem("codeVerifier", codeVerifier);
        setCodeChallenge(base64Encode(sha256(codeVerifier)));
      }
    } else {
      // Check if our token has expired
      const tokenObtainTime = parseInt(localStorage.getItem("tokenObtainTime"));
      const expires_in_sec = parseInt(localStorage.getItem("expiresin")) * 1000;
      if (Date.now() > tokenObtainTime + expires_in_sec) {
        generateRefreshToken();
      } else {
        setToken(localStorage.getItem("accesstoken"));
      }
    }
  }, [token, validState]);

  return (
    <div>
      {!validState && <p>ERROR: received invalid state from Spotify API</p>}
      {validState && !token && isRedirect && <p>Loading</p>}
      {validState && !token && !isRedirect && (
        <a
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
          )}&response_type=code&show_dialog=true&state=${urlState}&code_challenge_method=S256&code_challenge=${codeChallenge}`}
        >
          Login to Spotify
        </a>
      )}
      {validState && token && <Editor logout={logout} />}
    </div>
  );
};

export default App;
