
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Tool } from "./pages/Tool";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:tool" element={<Tool />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
