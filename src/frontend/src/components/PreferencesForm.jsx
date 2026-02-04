import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function PreferencesForm() {
  const { user } = useAuth();
  const [dietaryRestrictions, setDietaryRestrictions] = useState("none");
  const [allergies, setAllergies] = useState([]);
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAllergyChange = (allergen) => {
    setAllergies((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen],
    );
  };

  // Disable other input if checkbox is unchecked and remove value
  const handleOtherCheckbox = (e) => {
    setOtherChecked(e.target.checked);
    if (!e.target.checked) {
      setOtherValue("");
    }
  };

  const handleOtherValueChange = (e) => {
    setOtherValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const preferences = {
      dietaryRestrictions,
      allergies:
        otherChecked && otherValue ? [...allergies, otherValue] : allergies,
      userId: user?.id,
    };

    try {
      // TODO: Send to backend API
      console.log("Saving preferences:", preferences);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>{user?.isNewUser ? "One last Step!" : "Update Preferences"}</h1>
        <span className="user-header">
          {user?.isNewUser
            ? "Please update your dietary preferences and allergies to finish account creation:"
            : "Update your dietary preferences and allergies:"}
        </span>

        {success && (
          <div
            style={{
              color: "green",
              backgroundColor: "#d4edda",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            Preferences saved successfully!
          </div>
        )}

        <div>
          <label>Dietary Restrictions:</label>
          <br />
          <select
            name="dietaryRestrictions"
            id="dietaryRestrictions"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            disabled={isLoading}
          >
            <option value="none">None</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="halal">Halal</option>
            <option value="kosher">Kosher</option>
          </select>
        </div>

        <div>
          <label>Allergies:</label>
          <br />
          {["Peanuts", "Tree Nuts", "Shellfish", "Dairy"].map((allergen) => (
            <div key={allergen}>
              <input
                type="checkbox"
                id={allergen.toLowerCase().replace(" ", "")}
                checked={allergies.includes(allergen)}
                onChange={() => handleAllergyChange(allergen)}
                disabled={isLoading}
              />
              <label htmlFor={allergen.toLowerCase().replace(" ", "")}>
                {" "}
                {allergen}
              </label>
            </div>
          ))}

          <div>
            <input
              type="checkbox"
              id="other"
              name="other"
              checked={otherChecked}
              onChange={handleOtherCheckbox}
              disabled={isLoading}
            />
            <label htmlFor="other"> Other: </label>
            <input
              type="text"
              name="otherValue"
              placeholder="Enter Allergy"
              value={otherValue}
              onChange={handleOtherValueChange}
              disabled={!otherChecked || isLoading}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </>
  );
}
