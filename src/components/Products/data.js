import product1 from "../../images/lecheflan.jpg";
import product2 from "../../images/Macaroons.jpg";
import product3 from "../../images/Boracay.jpg";
import product4 from "../../images/Combo.jpg";
import product5 from "../../images/Mojitos.jpg";
import product6 from "../../images/spag.jpg";
import product7 from "../../images/carbonara.jpg";
import product8 from "../../images/palabok.jpg";

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "sweets", label: "Sweets" },
  { id: "snacks", label: "Snack Treats" },
  { id: "drinks", label: "Drinks" },
  { id: "combos", label: "Combos" },
];

export const productData = [
  {
    id: "leche-flan",
    img: product1,
    alt: "Creamy leche flan in a tub with caramel on top",
    name: "Creamy Leche Flan 1tub",
    desc: "A dessert made-up of eggs and milk with a soft caramel on top",
    price: "₱35.00",
    priceValue: 35,
    category: "sweets",
    button: "Add to cart",
    rating: 4.9,
    reviewsCount: 212,
  },
  {
    id: "coconut-macaroons",
    img: product2,
    alt: "Golden coconut macaroons",
    name: "Coconut Macaroons 6pcs",
    desc: "Chewy on the inside, crisp and golden on the outside",
    price: "₱60.00",
    priceValue: 60,
    category: "sweets",
    button: "Add to cart",
    rating: 4.8,
    reviewsCount: 186,
  },
  {
    id: "boracay-salad",
    img: product3,
    alt: "Boracay salad dessert with coconut meat",
    name: "Boracay Salad",
    desc: "A super delicious and creamy dessert with real coconut meat.",
    price: "₱35.00",
    priceValue: 35,
    category: "sweets",
    button: "Add to cart",
    rating: 4.7,
    reviewsCount: 143,
  },
  {
    id: "combo-delights",
    img: product4,
    alt: "Combo delights with macaroons and leche flan",
    name: "Combo Delights",
    desc: "6 pcs Macaroons + 1 Tub Creamy Leche Flan",
    price: "₱100.00",
    priceValue: 100,
    category: "combos",
    button: "Add to cart",
    rating: 4.9,
    reviewsCount: 231,
  },
  {
    id: "mojitos-drink",
    img: product5,
    alt: "Homemade mojitos drink",
    name: "Mojitos Drink ",
    desc: "Refresh yourself with our home made Mojitos drink.",
    price: "₱75.00",
    priceValue: 75,
    category: "drinks",
    button: "Add to cart",
    rating: 4.6,
    reviewsCount: 98,
  },
];

export const productDataMeal = [
  {
    id: "spaghetti",
    img: product6,
    alt: "Homemade sweet spaghetti",
    name: "Spaghetti",
    desc: "Homemade Sweet Spaghetti",
    price: "₱95.00",
    priceValue: 95,
    category: "snacks",
    button: "Add to cart",
    rating: 4.7,
    reviewsCount: 167,
  },
  {
    id: "tuna-carbonara",
    img: product7,
    alt: "Homemade spicy tuna carbonara",
    name: "Tuna Carbonara",
    desc: "Homemade Spicy Tuna Carbonara",
    price: "₱105.00",
    priceValue: 105,
    category: "snacks",
    button: "Add to cart",
    rating: 4.8,
    reviewsCount: 154,
  },
  {
    id: "pancit-palabok",
    img: product8,
    alt: "Homemade spicy pancit palabok",
    name: "Spicy Pancit Palabok",
    desc: "Homemade Pancit Palabok",
    price: "₱125.00",
    priceValue: 125,
    category: "snacks",
    button: "Add to cart",
    rating: 4.9,
    reviewsCount: 198,
  },
];

export const allProducts = [...productData, ...productDataMeal];
