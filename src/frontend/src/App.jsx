import AuthPage from "./pages/AuthPage";
import UserManagementPage from "./pages/UserPage";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import UserPage from "./pages/UserLanding";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<UserManagementPage />} />
          <Route path="/userpage" element={<UserPage />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
