import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { AuthContextProvider } from "./context/auth-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
