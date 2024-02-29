import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { App } from "./App";
import { Login } from "./pages/login/components";

const rootElement = document.getElementById("root");
createRoot(rootElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="our-money/" element={<Login />} />
      <Route path="/our-money/transactions" element={<App />} />
    </Routes>
  </BrowserRouter>
);
