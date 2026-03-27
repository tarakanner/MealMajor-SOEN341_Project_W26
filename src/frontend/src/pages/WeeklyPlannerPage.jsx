import React, { useEffect, useState } from "react";
import { getRecipes } from "../services/recipeService.js";
import { getMealPlan, addOrUpdateMeal, deleteMeal } from "../services/mealPlanService.js";
import PlannerCell from "../components/PlannerCell.jsx";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

function WeeklyMealPlannerPage() {
  const [recipes, setRecipes] = useState([]);
  const [meals, setMeals] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [preventDuplicates, setPreventDuplicates] = useState(() => {
    return localStorage.getItem("preventDuplicates") === "true";
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      getRecipes(userId)
        .then((data) => setRecipes(data || []))
        .catch(() => setRecipes([]));

      getMealPlan(userId)
        .then((plan) => {
          if (plan && plan.meals) {
            const formattedMeals = {};
            plan.meals.forEach((meal) => {
              const capitalizedType = meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1);
              if (!formattedMeals[meal.day]) formattedMeals[meal.day] = {};
              formattedMeals[meal.day][capitalizedType] = {
                ...meal.recipeId,
                mealId: meal._id
              };
            });
            setMeals(formattedMeals);
          }
        })
        .catch((err) => {
          console.error(err);
          setDuplicateWarning("Failed to load your weekly meal plan.");
        });
    }
  }, []);

  //if getMeal or updateMeal are being weird let me know cause I this works as far as I tested but its a bit weird
  const getMeal = (day, mealType) => {
    //KEEP THIS CHECK or it breaks since looking into null
    if (!meals[day]) return null;
    return meals[day][mealType];
  };

  const updateMeal = (day, mealType, value) => {
    //needs to duplicate meals object or the React re render doen't trigger and change doesnt show
    const updatedMeals = { ...meals };
    //select unique day
    const updatedDay = { ...updatedMeals[day] };

    updatedDay[mealType] = value;
    updatedMeals[day] = updatedDay;

    setMeals(updatedMeals);
  };

  //can't just pass the function since we're passing it donw to a component and it breaks otherwise
  //also since the component will pass up which exact cell, AND THEN we can open
  const handleAdd = (day, mealType) => {
    if (getMeal(day, mealType)) {
      setDuplicateWarning(
        `This meal slot already has a recipe assigned. Please edit or remove it first.`,
      );
      return;
    }
    setDuplicateWarning(null);
    setSelectedCell({ day, mealType });
  };

  const handleEdit = (day, mealType) => {
    setDuplicateWarning(null);
    setSelectedCell({ day, mealType });
  };

  const handleSelectRecipe = async (recipe) => {
    const day = selectedCell.day;
    const mealType = selectedCell.mealType;
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setDuplicateWarning("Please log in to assign meals.");
      return;
    }

    if (preventDuplicates) {
      const recipeId = recipe._id || recipe.id;
      
      // Construct what the day WOULD look like with this recipe added
      const simulatedDayMeals = { ...(meals[day] || {}) };
      simulatedDayMeals[mealType] = { ...recipe, _id: recipeId, id: recipeId };

      // Compare this simulated day to every other day
      for (const otherDay of days) {
        if (otherDay === day) continue;
        
        const otherDayMeals = meals[otherDay] || {};
        let isMatch = true;

        for (const type of mealTypes) {
          const m1 = simulatedDayMeals[type];
          const m2 = otherDayMeals[type];

          const id1 = m1 ? (m1._id || m1.id) : null;
          const id2 = m2 ? (m2._id || m2.id) : null;

          if (id1 !== id2) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          setDuplicateWarning(`Cannot add: This would make ${day}'s meal plan identical to ${otherDay}'s.`);
          return;
        }
      }
    }

    try {
      const recipeId = recipe._id || recipe.id;
      const plan = await addOrUpdateMeal(userId, day, mealType.toLowerCase(), recipeId);
      const updatedMeal = plan.meals.find(m => m.day === day && m.mealType === mealType.toLowerCase());
      
      updateMeal(day, mealType, { ...recipe, mealId: updatedMeal._id });
      setSelectedCell(null);
    } catch (error) {
      console.error(error);
      setDuplicateWarning("Failed to update meal plan.");
    }
  };
  //same idea here
  const handleDelete = async (day, mealType) => {
    const meal = getMeal(day, mealType);
    const userId = localStorage.getItem("userId");

    if (meal && meal.mealId && userId) {
      try {
        await deleteMeal(userId, meal.mealId);
        updateMeal(day, mealType, null);
      } catch (error) {
        console.error(error);
        setDuplicateWarning("Failed to delete meal.");
      }
    } else {
      updateMeal(day, mealType, null);
    }
  };

  return (
    <div className="planner_page">
      <h2>Weekly Meal Planner</h2>

      <div className="planner_controls" style={{ marginBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: "bold" }}>
          <input
            type="checkbox"
            checked={preventDuplicates}
            onChange={(e) => {
              const val = e.target.checked;
              setPreventDuplicates(val);
              localStorage.setItem("preventDuplicates", val);
            }}
          />
          Prevent Duplicate Days
        </label>
      </div>

      <div className="planner_grid">
        <div className="planner_row">
          <div></div>
          {days.map((day) => (
            <div key={day} className="planner_header">
              {day}
            </div>
          ))}
        </div>

        {mealTypes.map((mealType) => (
          <div key={mealType} className="planner_row">
            <div className="planner_header">{mealType}</div>

            {days.map((day) => (
              <PlannerCell
                meal={getMeal(day, mealType)}
                day={day}
                mealType={mealType}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ))}
      </div>

      {duplicateWarning && (
        <div className="planner_warning" role="alert">
          <p>{duplicateWarning}</p>
          <button onClick={() => setDuplicateWarning(null)}>Dismiss</button>
        </div>
      )}

      {selectedCell && (
        <div className="planner_overview" onClick={() => setSelectedCell(null)}>
          <div className="planner_choice" onClick={(e) => e.stopPropagation()}>
            <button
              className="close_button"
              onClick={() => setSelectedCell(null)}
            >
              X
            </button>

            <h3>
              {selectedCell.day} - {selectedCell.mealType}
            </h3>

            {recipes.length == 0 ? (
              <p>No recipes found :(</p>
            ) : (
              recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  className="planner_button"
                  onClick={() => handleSelectRecipe(recipe)}
                >
                  {recipe.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyMealPlannerPage;
