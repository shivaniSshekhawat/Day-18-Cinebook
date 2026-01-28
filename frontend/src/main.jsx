import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { LoadingProvider } from "./context/LoadingContext";
import Loader from "./components/Loader";

ReactDOM.createRoot(document.getElementById("root")).render(
  <LoadingProvider>
    <Loader />
    <App />
  </LoadingProvider>
);