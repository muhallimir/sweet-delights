import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";

export const Nav = styled.nav`
  background: transparent;
  position: float;
  height: 80px;
  display: flex;
  padding-left: 20px;
  font-weight: 700;
`;

export const NavLink = styled(Link)`
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;

  @media screen and (max-width: 400px) {
    position: absolute;
    top: 5px;
    left: 25px;
    font-size: 1.5rem;
  }
`;

export const NavIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  position: absolute;
  top: 0;
  right: 0;
  padding: 1.1rem 1.25rem 0 0;
  color: white;

  p {
    font-weight: bold;
    margin: 0;
  }
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.4rem 0.5rem;
  border-radius: 0.6rem;

  &:hover,
  &:focus-visible {
    color: #e3c987;
    outline: 2px solid #e3c987;
    outline-offset: 2px;
  }
`;

export const CartButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #d5af4c;
  border: none;
  color: #111;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: #ffc500;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -6px;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  border-radius: 999px;
  background: #f2003c;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Bars = styled(IoFastFoodOutline)`
  font-size: 2rem;
  color: white;

  transform: translate(-50%, -15%);
`;
