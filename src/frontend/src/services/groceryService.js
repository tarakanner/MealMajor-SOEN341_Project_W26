//please add the real backend here
//added a fake list for testing etc

const productsArray = [
  {
    name: "Non-Stick Frying Pan",
    price: "29.99",
    link: "",
    storeName: "IGA",
  },
  {
    name: "Chef Knife",
    price: "45.00",
    link: "",
  },
  {
    name: "Cutting Board",
    price: "18.50",
    link: "",
    storeName: "IGA",
  },
  {
    name: "Mixing Bowl Set",
    price: "",
    link: "",
  },
];

export async function getGroceryList() {

  return productsArray;
}