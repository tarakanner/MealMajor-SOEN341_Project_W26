import { useState, useEffect, useRef } from "react";
import { CreateNewRecipeForm } from "./CreateNewRecipeForm";
import "./CreateRecipe.css";

export default function CreateRecipe({ onRecipeCreated }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFormOpen) {
      setShouldRender(true);
      // Trigger animation after render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFormOpen]);

  return (
    <div style={{ width: "100%" }}>
      <button
        type="button"
        className="blue_button"
        onClick={() => setIsFormOpen((open) => !open)}
      >
        {isFormOpen ? "Close" : "Create recipe"}
      </button>

      {shouldRender && (
        <div
          className={`recipe-form-container ${isAnimating ? "recipe-form-enter" : ""}`}
        >
          <CreateNewRecipeForm
            onSubmit={(recipe) => {
              onRecipeCreated?.(recipe);
              setIsFormOpen(false);
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
