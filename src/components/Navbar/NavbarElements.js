import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";

export const Nav = styled.nav`
  background: transparent;
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 1.25rem;
  font-weight: 700;
`;

export const NavLink = styled(Link)`
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  @media screen and (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const NavIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: white;
  min-width: 0;
  flex-wrap: nowrap;

  p {
    font-weight: bold;
    margin: 0;
  }

  @media screen and (max-width: 420px) {
    gap: 0.25rem;
  }
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 999px;
  flex-shrink: 0;
  width: auto;

  &:hover,
  &:focus-visible {
    color: #e3c987;
    border-color: #e3c987;
    outline: 2px solid #e3c987;
    outline-offset: 2px;
  }
  @media screen and (max-width: 480px) {
    padding: 0.3rem 0.4rem;
    min-width: 36px;
    > span {
      display: none;
    }
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
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 0.9rem;

  &:hover,
  &:focus-visible {
    background: #ffc500;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  @media screen and (max-width: 420px) {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
    svg + span {
      display: none;
    }
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
  font-size: 1.5rem;
  color: white;
`;
