import AuthPage from "./pages/AuthPage";
import UserManagementPage from "./pages/UserPage";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import UserPage from "./pages/UserLanding";
import {Recipes} from "./pages/Recipes";
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
          <Route path="/recipes" element={< Recipes/>} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
