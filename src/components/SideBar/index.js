import React from "react";
import { Link } from "react-router-dom";
import {
  SideBarContainer,
  Icon,
  CloseIcon,
  SideBarMenu,
  SideBarLink,
  SideBtnWrap,
  SideBarRoute,
} from "./SideBarElements";

const SideBar = ({ isOpen, toggle }) => {
  return (
    <SideBarContainer
      isOpen={isOpen}
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Site menu"
    >
      <Icon onClick={toggle} aria-label="Close menu" role="button" tabIndex={isOpen ? 0 : -1}>
        <CloseIcon />
      </Icon>
      <SideBarMenu>
        <SideBarLink as="a" href="#menu" onClick={toggle}>
          Sweets
        </SideBarLink>
        <SideBarLink as="a" href="#menu" onClick={toggle}>
          Snack Treats
        </SideBarLink>
        <SideBarLink as="a" href="#catering" onClick={toggle}>
          Catering
        </SideBarLink>
        <SideBarLink as={Link} to="/checkout" onClick={toggle}>
          Checkout
        </SideBarLink>
      </SideBarMenu>
      <SideBtnWrap>
        <SideBarRoute as="a" href="#menu" onClick={toggle}>
          Place Order
        </SideBarRoute>
      </SideBtnWrap>
    </SideBarContainer>
  );
};

export default SideBar;
