import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast"; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> 
    </AuthProvider>
  </React.StrictMode>
);
