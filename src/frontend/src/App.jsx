import AuthPage from "./pages/AuthPage";
import UserManagementPage from "./pages/UserPage";
import LandingPage from "./components/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserManagementPage />} />
      </Routes>
    </Router>
  );
}
export default App;
