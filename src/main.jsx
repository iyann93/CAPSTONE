import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./utils/toast"; // Initialize global toast override
import ToastContainer from "./components/ui/ToastContainer";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer />
    <App />
  </StrictMode>
);

