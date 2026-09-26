import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";

function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div id="dashboard-section">
        <Dashboard />
      </div>
    </div>
  );
}

import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy_client_id_for_dev"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
