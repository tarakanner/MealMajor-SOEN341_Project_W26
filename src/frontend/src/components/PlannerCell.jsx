import React from "react";
import PropTypes from "prop-types";

function PlannerCell({ meal, day, mealType, onAdd, onEdit, onDelete }) {
  return (
    <div className="planner_cell">
      {meal ? (
        <div className="planner_cell_content">
          <p>{meal.name}</p>
          <button className="blue_button" onClick={() => onEdit(day, mealType)}>
            Edit
          </button>
          <button
            className="red_button"
            onClick={() => onDelete(day, mealType)}
          >
            Delete
          </button>
        </div>
      ) : (
        <button className="blue_button" onClick={() => onAdd(day, mealType)}>
          Add meal
        </button>
      )}
    </div>
  );
}

PlannerCell.propTypes = {
  meal: PropTypes.object,
  day: PropTypes.string.isRequired,
  mealType: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PlannerCell;
