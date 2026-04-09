function GroceryListResult({ groceryItems, onBought }) {
  if (!groceryItems || groceryItems.length === 0) {
    return (
      <div className="grocery_page">
        <h2 className="grocery_page_title">Grocery List</h2>
        <p className="grocery_page_title">No missing ingredients found :(</p>
      </div>
    );
  }

  return (
    <div className="grocery_page">
      <h2 className="grocery_page_title">Missing Ingredients</h2>

      <div className="grocery_list">
        {groceryItems.map((item) => (
          <div className="grocery_card">
            <div className="grocery_row_header">{item.name}</div>

            <div className="grocery_row">
              <p className="grocery_label">
                Cheapest Store:&nbsp;
                <span style={{ fontWeight: "bold", color: "#2e77ca" }}>
                  {item.storeName ? item.storeName : "N/A"}
                </span>
              </p>
            </div>

            <div className="grocery_row">
              <p className="grocery_label">
                Price:&nbsp;
                <span style={{ fontWeight: "bold", color: "#2e77ca" }}>
                  ${item.price ? item.price : "N/A"}
                </span>
              </p>
            </div>
            <button className="blue_button">
              <a href={item.productLink}>View Product</a>
            </button>
            <div className="grocery_row">
              <button className="blue_button" onClick={() => onBought(item)}>
                Bought
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroceryListResult;
