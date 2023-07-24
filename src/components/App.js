import React, { useState, useEffect } from "react";
import localforage from "localforage";

import Login from "./Login";

import Editor from "./Editor";

const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = "c55715b0bcae4293b92804f55b94c15c";

// local testing Uri
// const redirectUri = "http://localhost:3000/";
// production Uri
const redirectUri = "https://build.d2j8twv1ebltnq.amplifyapp.com/";

const scopes = [
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
];

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

const generateRandomString = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const base64Encode = (string) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64Encode(digest);
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("accesstoken"));
  const [validState, setValidState] = useState(true);
  const [codeChallenge, setCodeChallenge] = useState(null);
  const [urlState, setUrlState] = useState(null);
  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    const generateURLparams = async () => {
      const state = generateRandomString(16);
      setUrlState(state);
      sessionStorage.setItem("state", state);
      const codeVerifier = generateRandomString(128);
      sessionStorage.setItem("codeVerifier", codeVerifier);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      setCodeChallenge(codeChallenge);
    };
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
        generateURLparams();
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
        <Login
          authEndpoint={authEndpoint}
          clientId={clientId}
          redirectUri={redirectUri}
          urlState={urlState}
          codeChallenge={codeChallenge}
          scopes={scopes}
        />
      )}
      {validState && token && <Editor logout={logout} />}
    </div>
  );
};

export default App;
