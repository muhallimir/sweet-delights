import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyles";
import Hero from "./components/Hero";
import { allProducts } from "./components/Products/data";
import MenuExperience from "./components/Menu/MenuSection";
import Featured from "./components/Featured";
import BestsellersRail from "./components/Bestsellers/BestsellersRail";
import DailyDeal from "./components/Deal/DailyDeal";
import BoxBuilder from "./components/BoxBuilder/BoxBuilder";
import SubscribeBox from "./components/Subscriptions/SubscribeBox";
import Testimonials from "./components/Testimonials/Testimonials";
import Newsletter from "./components/Newsletter/Newsletter";
import Catering from "./components/Catering/Catering";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop/BackToTop";
import NotFound from "./components/NotFound/NotFound";
import Reveal from "./components/Reveal/Reveal";
import Typical from "react-typical";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/Cart/CartDrawer";
import CheckoutPage from "./components/Checkout/CheckoutPage";

function Home() {
  return (
    <>
      <Hero />
      <Reveal>
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
      </Reveal>
      <Featured />
      <DailyDeal />
      <BoxBuilder />
      <SubscribeBox />
      <Reveal>
        <BestsellersRail />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
      <Reveal>
        <Catering />
      </Reveal>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <GlobalStyle />
        <a href="#menu" className="sr-only">
          Skip to menu
        </a>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route component={NotFound} />
        </Switch>
        <CartDrawer />
        <BackToTop />
      </CartProvider>
    </Router>
  );
}

export default App;
