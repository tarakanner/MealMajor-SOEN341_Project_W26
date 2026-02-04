import PreferencesForm from "../components/PreferencesForm";
import { useAuth } from "../hooks/useAuth";

export default function UserPage() {
  const { user } = useAuth();

  return (
    <div className="User-Page">
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h2>Profile Settings</h2>
        <p className="user-header">
          Manage your meal preferences and dietary restrictions
        </p>
      </div>
      <PreferencesForm />
    </div>
  );
}
