import React from "react";
import "./css/Login.css";

interface LoginProps {
  authEndpoint: string;
  clientId: string;
  redirectUri: string;
  urlState: string | null;
  codeChallenge: string | null;
  scopes: Array<string>;
}

const Login = (props: LoginProps): JSX.Element => {
  const {
    authEndpoint,
    clientId,
    redirectUri,
    urlState,
    codeChallenge,
    scopes,
  } = props;
  return (
    <div className="login">
      <a
        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=code&show_dialog=true&state=${urlState}&code_challenge_method=S256&code_challenge=${codeChallenge}`}
      >
        Login to Spotify
      </a>
    </div>
  );
};

export default Login;
