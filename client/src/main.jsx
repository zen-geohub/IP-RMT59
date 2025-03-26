import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "../stores/index.js";
import { MapProvider } from "react-map-gl/maplibre";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <MapProvider>
        <App />
      </MapProvider>
    </Provider>
  </StrictMode>
);
