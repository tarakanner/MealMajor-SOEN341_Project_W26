import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroceryListResult from "../components/GroceryListResult";

const MISSING = ["flour", "butter", "chicken"];
const MOCK_ITEMS = [
  { name: "flour",   storeName: "Walmart", price: "$1.98", link: "https://walmart.com/flour" },
  { name: "butter",  storeName: "IGA",     price: "$3.49", link: "https://iga.net/butter" },
  { name: "chicken", storeName: "Costco",  price: "$9.99", link: "https://costco.ca/chicken" },
];

// ── Frontend ── //
describe("AT 8.2 Frontend", () => {

  // Steps 4–6: AI returns cheapest options → store, price, and link displayed per ingredient
  test("displays store, price, and link for each missing ingredient", () => {
    render(<GroceryListResult groceryItems={MOCK_ITEMS} onBought={jest.fn()} />);

    // Name, cheapest store, and price visible for each item
    expect(screen.getByText(/flour/i)).toBeInTheDocument();
    expect(screen.getByText(/walmart/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1\.98/i)).toBeInTheDocument();

    expect(screen.getByText(/butter/i)).toBeInTheDocument();
    expect(screen.getByText(/iga/i)).toBeInTheDocument();
    expect(screen.getByText(/\$3\.49/i)).toBeInTheDocument();

    expect(screen.getByText(/chicken/i)).toBeInTheDocument();
    expect(screen.getByText(/costco/i)).toBeInTheDocument();
    expect(screen.getByText(/\$9\.99/i)).toBeInTheDocument();

    // One clickable "View Product" link per ingredient
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(MISSING.length);
    links.forEach((link) => expect(link.getAttribute("href")).toMatch(/^https?:\/\//));
  });

  // No missing ingredients case
  test("shows 'No missing ingredients' when grocery list is empty", () => {
    render(<GroceryListResult groceryItems={[]} onBought={jest.fn()} />);
    expect(screen.getByText(/no missing ingredients/i)).toBeInTheDocument();
  });
});
