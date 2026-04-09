//depending on how the backend will be finished this page may need modifications, I left comments in the main part that might need to change

import { useEffect, useState } from "react";
import { getGroceryList } from "../services/groceryService.js";
import { getFridge, saveIngredients } from "../services/fridgeService.js";
import GroceryListResult from "../components/GroceryListResult.jsx";

function GroceryListPage() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      return;
    }

    getGroceryList(userId)
      .then((data) => {
        setGroceryItems(data || []);
        setError("");
      })
      .catch(() => {
        setError("Could not retrieve grocery list :(");
        setGroceryItems([]);
      });
  }, [userId]);

  const handleBought = async (item) => {
    if (!userId) {
      setError("User not found :(");
      return;
    }

    try {
      //in theory this isnt necessary since it's handled in the backedn but it's a second check to avoid showing items already in the fridge
      const fridge = await getFridge(userId);
      const currentIngredients = fridge?.ingredients || [];
      //to simplify, the item bought wiill go as 1 unit but the user can change it after
      const updatedIngredients = [
        ...currentIngredients,
        {
          name: item.name,
          quantity: 1,
          unit: "units",
        },
      ];

      await saveIngredients(userId, updatedIngredients);

      //this is necessary to remove the item that the user just pressed "bought" on
      setGroceryItems((prev) =>
        prev.filter((groceryItem, index) =>
          groceryItem._id
            ? groceryItem._id !== item._id
            : index !== prev.indexOf(item),
        ),
      );

      setError("");
    } catch {
      setError("Could not add ingredient to fridge :(");
    }
  };

  return (
    <div style={{ margin: "auto", width: "100%" }}>
      {error ? (
        <p style={{ textAlign: "center", color: "red", fontSize: "24px" }}>
          {error}
        </p>
      ) : (
        <GroceryListResult
          groceryItems={groceryItems}
          onBought={handleBought}
        />
      )}
    </div>
  );
}

export default GroceryListPage;
