import React from "react";
import {
  Bars,
  Nav,
  NavIcon,
  NavLink,
  MenuButton,
  CartButton,
  CartBadge,
} from "./NavbarElements";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const Navbar = ({ toggle }) => {
  const { count, openCart } = useCart();
  return (
    <>
      <Nav>
        <NavLink to="/" aria-label="Sweet Delights home">
          Sweet Delights
        </NavLink>
        <NavIcon>
          <CartButton
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
          >
            <FaShoppingCart aria-hidden="true" />
            <span>Cart</span>
            {count > 0 && (
              <CartBadge aria-hidden="true">{count > 99 ? "99+" : count}</CartBadge>
            )}
          </CartButton>
          <MenuButton onClick={toggle} aria-label="Open menu">
            <span>Menu</span>
            <Bars aria-hidden="true" />
          </MenuButton>
        </NavIcon>
      </Nav>
    </>
  );
};

export default Navbar;
