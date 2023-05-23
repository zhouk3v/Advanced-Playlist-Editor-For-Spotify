import React, { useState, useEffect, createContext } from "react";
import {
  CLIENT_ID,
  REDIRECT_URI,
  storeToken,
  generateRefreshToken,
} from "../API/api";

const generateRandomString = (length: number) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const base64Encode = (string: ArrayBuffer) => {
  return window
    .btoa(String.fromCharCode(...new Uint8Array(string)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const generateCodeChallenge = async (codeVerifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64Encode(digest);
};

interface AuthContextProps {
  token: string | null;
  validState: boolean;
  codeChallenge: string | null;
  urlState: string | null;
  isRedirect: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  validState: true,
  codeChallenge: "",
  urlState: "",
  isRedirect: false,
});

interface AuthContextProviderProps {
  children: JSX.Element;
}

export const AuthContextProvider = (
  props: AuthContextProviderProps
): JSX.Element => {
  // TODO: See if we can remove some states here, can we just manage with localStorage?
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accesstoken")
  );
  const [validState, setValidState] = useState(true);
  const [codeChallenge, setCodeChallenge] = useState<string | null>(null);
  const [urlState, setUrlState] = useState<string | null>(null);
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

    const generateNewToken = async (code: string) => {
      // Grab the code verifier from session storage
      const codeVerifier = sessionStorage.getItem("codeVerifier");
      // Send a POST request with the code to get an access token, refresh token and
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier ?? "",
        }),
      });
      const json = await res.json();
      storeToken(json);
      // Clear the url search params
      window.location.search = "";
      setToken(json.access_token);
    };

    const generateRefreshTokenStartup = async () => {
      const token = await generateRefreshToken();
      setToken(token);
    };

    const tokenExists = localStorage.getItem("accesstoken");
    if (!tokenExists) {
      // Get the search parameters, if any from the url
      const params = new URL(window.location.toString()).searchParams;
      const codeParam = params.get("code");
      const urlStateParam = params.get("state");
      // If we were redirected from spotify, we should get 2 search parameters: code and state
      if (codeParam && urlStateParam) {
        // Validate the state in the redirectUri
        const savedState = sessionStorage.getItem("state");
        setValidState(urlStateParam === savedState);
        if (validState) {
          setIsRedirect(true);
          generateNewToken(codeParam);
        }
      } else {
        // Generate state and code challenge
        generateURLparams();
      }
    } else {
      // Check if our token has expired
      const tokenObtainTime = parseInt(
        localStorage.getItem("tokenObtainTime") ?? "0"
      );
      const expires_in_sec =
        parseInt(localStorage.getItem("expiresin") ?? "0") * 1000;
      if (Date.now() > tokenObtainTime + expires_in_sec) {
        generateRefreshTokenStartup();
      } else {
        setToken(localStorage.getItem("accesstoken"));
      }
    }
  }, [token, validState]);

  return (
    <AuthContext.Provider
      value={{
        token,
        validState,
        codeChallenge,
        urlState,
        isRedirect,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
