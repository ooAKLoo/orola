import { Routes, Route, useLocation } from "react-router-dom";
import SensePage from "./pages/SensePage";
import SpotPage from "./pages/SpotPage";
import DropPage from "./pages/DropPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NavBar from "./components/NavBar";
import LocationConsent from "./components/LocationConsent";
import { useLocationConsent } from "./hooks/useLocationConsent";

export default function App() {
  const { consented, grant } = useLocationConsent();
  const location = useLocation();

  // Always allow access to legal pages
  const isLegalPage =
    location.pathname === "/privacy" || location.pathname === "/terms";

  if (!consented && !isLegalPage) {
    return (
      <Routes>
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<LocationConsent onConsent={grant} />} />
      </Routes>
    );
  }

  return (
    <div className="h-full flex flex-col bg-orola-cream">
      <div className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<SensePage />} />
          <Route path="/spot/:id" element={<SpotPage />} />
          <Route path="/drop" element={<DropPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}
