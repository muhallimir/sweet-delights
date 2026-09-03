import { BrowserRouter as Router } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyles";
import Hero from "./components/Hero";
import Products from "./components/Products";
import { productData, productDataMeal } from "./components/Products/data";
import Featured from "./components/Featured";
import Footer from "./components/Footer";
import Typical from "react-typical";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/Cart/CartDrawer";

function App() {
  return (
    <Router>
      <CartProvider>
        <GlobalStyle />
        <Hero />
        <Products
          id="menu"
          heading={
            <Typical
              steps={["Pick your sweets", 900, "Message us now 🥰", 1000]}
              loop={Infinity}
              wrapper="p"
            />
          }
          data={productData}
        />
        <Featured />
        <Products
          heading={
            <Typical
              steps={["Snack Treats", 1000, "For you 😍", 1000]}
              loop={Infinity}
              wrapper="p"
            />
          }
          data={productDataMeal}
        />

        <Footer />
        <CartDrawer />
      </CartProvider>
    </Router>
  );
}

export default App;
