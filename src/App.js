import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyles";
import Hero from "./components/Hero";
import { allProducts } from "./components/Products/data";
import MenuExperience from "./components/Menu/MenuSection";
import Featured from "./components/Featured";
import Testimonials from "./components/Testimonials/Testimonials";
import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "./components/Footer";
import Typical from "react-typical";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/Cart/CartDrawer";
import CheckoutPage from "./components/Checkout/CheckoutPage";

function Home() {
  return (
    <>
      <Hero />
      <MenuExperience
        id="menu"
        heading={
          <Typical
            steps={["Pick your sweets", 900, "Fresh daily 🥰", 1000]}
            loop={Infinity}
            wrapper="p"
          />
        }
        products={allProducts}
      />
      <Featured />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <GlobalStyle />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route
            render={() => (
              <>
                <Hero />
                <div
                  style={{
                    background: "#0d0d0d",
                    color: "#fff",
                    textAlign: "center",
                    padding: "4rem 1rem",
                  }}
                >
                  <h1>Page coming soon</h1>
                  <p>Full site navigation lands with the next update.</p>
                  <a href="/" style={{ color: "#e3c987" }}>
                    Back to home
                  </a>
                </div>
                <Footer />
              </>
            )}
          />
        </Switch>
        <CartDrawer />
      </CartProvider>
    </Router>
  );
}

export default App;
