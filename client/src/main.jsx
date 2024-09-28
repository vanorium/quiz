import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./global.css";
import socket from "./socket.js"

createRoot(document.getElementById("root")).render(<App />);
