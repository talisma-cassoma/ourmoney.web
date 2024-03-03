import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { App } from "./App";
import { Login } from "./pages/login/components";
import { AuthContextProvider } from "./contexts/AuthContext";
//import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root");
createRoot(rootElement).render(
 // <GoogleOAuthProvider clientId="75067421805-maac5mvgluvp53g7slga5326krteuf5t.apps.googleusercontent.com"> 
  <BrowserRouter>
   <AuthContextProvider>
    <Routes>
      <Route path="/our-money/" element={<Login />} />
      <Route path="/our-money/transactions" element={<App />} />
    </Routes>
    </AuthContextProvider>
  </BrowserRouter>

);
