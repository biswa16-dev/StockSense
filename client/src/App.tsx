import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Dashboard from "./pages/Dashboard";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
