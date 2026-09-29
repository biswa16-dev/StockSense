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
    <GoogleOAuthProvider clientId="846329288786-u0dcq8hq0hgrf7ousqmgi5q2orl19jvv.apps.googleusercontent.com">
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
