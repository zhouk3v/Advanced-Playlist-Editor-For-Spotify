import React, { useState, useEffect } from "react";
import crypto from "crypto";

import Editor from "./Editor";

const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = "c55715b0bcae4293b92804f55b94c15c";

// local testing Uri
const redirectUri = "http://localhost:3000/";
// production Uri

const scopes = [];

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

const storeToken = (json) => {
  // Store the time that we get the access token
  localStorage.setItem("tokenObtainTime", Date.now());

  // Store the access token, refresh token and expiry time into local storage
  localStorage.setItem("accesstoken", json.access_token);
  localStorage.setItem("refreshtoken", json.refresh_token);
  localStorage.setItem("expiresin", json.expires_in);
};

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("accesstoken"));
  const [validState, setValidState] = useState(true);
  const [codeChallenge, setCodeChallenge] = useState(null);
  const [urlState, setUrlState] = useState(null);

  useEffect(() => {
    const generateNewToken = (code) => {
      // Grab the code verifier from session storage
      const codeVerifier = sessionStorage.getItem("codeVerifier");
      // Send a POST request with the code to get an access token, refresh token and
      fetch("https://accounts.spotify.com/api/token", {
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
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          storeToken(json);
          setToken(json.access_token);
          // Clear the url search params
          window.location.search = "";
        });
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
      setToken(localStorage.getItem("accesstoken"));
    }
  }, [token, validState]);

  return (
    <div>
      {!validState && <p>ERROR: received invalid state from Spotify API</p>}
      {!token && validState && (
        <a
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
          )}&response_type=code&show_dialog=true&state=${urlState}&code_challenge_method=S256&code_challenge=${codeChallenge}`}
        >
          Login to Spotify
        </a>
      )}
      {token && validState && <Editor token={token} logout={logout} />}
    </div>
  );
};

export default App;
