import { Link } from "react-router-dom";
import PreferencesForm from "../components/PreferencesForm";

export default function UserPage() {
  return (
    <div className="User-Page">
      <PreferencesForm />
      <div style={{ marginTop: 24 }}>
        <Link to="/search">
          <button className="search-button">Go to Recipes</button>
        </Link>
      </div>
    </div>
  );
}
