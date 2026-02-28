import { Routes, Route } from "react-router-dom";
import SensePage from "./pages/SensePage";
import SpotPage from "./pages/SpotPage";
import DropPage from "./pages/DropPage";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div className="h-full flex flex-col bg-orola-cream">
      <div className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<SensePage />} />
          <Route path="/spot/:id" element={<SpotPage />} />
          <Route path="/drop" element={<DropPage />} />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}
