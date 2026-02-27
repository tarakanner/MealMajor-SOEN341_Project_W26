import AuthPage from "./pages/AuthPage";
import UserManagementPage from "./pages/UserPage";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import UserPage from "./pages/UserLanding";
import PreferencesForm from "./components/PreferencesForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RecipeResultPage from "./pages/RecipeResultPage.jsx";
import RecipePage from "./pages/RecipePage.jsx";

import { templateRecipes } from "./data/templateRecipes.js";

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
          <Route path="/preferences" element={<PreferencesForm />} />
          <Route
            path="/search"
            element={<RecipeResultPage recipes={templateRecipes} />}
          />
          <Route path="/recipes" element={<RecipePage />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
