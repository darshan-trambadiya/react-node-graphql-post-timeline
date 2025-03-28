// external
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

// css
import "./index.css";

// components
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
