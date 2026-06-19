import { createRoot } from "react-dom/client";
import { RouteEditorApp } from "./RouteEditorApp";
import "../styles/index.css";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("route-editor-root")!).render(
  <RouteEditorApp />,
);
