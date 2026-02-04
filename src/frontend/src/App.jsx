import AuthPage from "./pages/AuthPage";
import UserManagementPage from "./pages/UserPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserManagementPage />} />
      </Routes>
    </Router>
  );
}
export default App;
