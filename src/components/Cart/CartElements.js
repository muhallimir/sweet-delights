import styled from "styled-components";

export const CartOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: opacity 0.25s ease;
  z-index: 998;
`;

export const CartAside = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(400px, 100vw);
  background: #111;
  color: #fff;
  z-index: 999;
  transform: translateX(${({ open }) => (open ? "0" : "100%")});
  transition: transform 0.28s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.45);
`;

export const CartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  h2 {
    font-size: 1.25rem;
    margin: 0;
  }
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 999px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  &:hover,
  &:focus-visible {
    background: #e3c987;
    color: #111;
    border-color: #e3c987;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const CartBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
`;

export const EmptyMsg = styled.p`
  text-align: center;
  opacity: 0.85;
  margin-top: 3rem;
  line-height: 1.6;
`;

export const CartItem = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const ItemImg = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
`;

export const ItemInfo = styled.div`
  min-width: 0;
  h3 {
    font-size: 0.95rem;
    margin: 0 0 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.85;
  }
`;

export const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
`;

export const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  &:hover,
  &:focus-visible {
    background: #e3c987;
    color: #111;
    border-color: #e3c987;
    outline: 2px solid #fff;
    outline-offset: 1px;
  }
`;

export const RemoveBtn = styled.button`
  background: transparent;
  border: none;
  color: #ff9a9a;
  cursor: pointer;
  font-size: 0.82rem;
  padding: 0.25rem 0;
  text-decoration: underline;
  &:hover,
  &:focus-visible {
    color: #fff;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const CartFooter = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1rem 1.25rem 1.25rem;
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.4rem;
    font-size: 0.95rem;
  }
  .total {
    font-size: 1.15rem;
    font-weight: 700;
    color: #e3c987;
  }
  .hint {
    font-size: 0.8rem;
    opacity: 0.75;
    margin-bottom: 0.8rem;
  }
`;

export const CheckoutBtn = styled.a`
  display: block;
  text-align: center;
  background: #d5af4c;
  color: #111;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  text-decoration: none;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: #ffc500;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const ContinueBtn = styled.button`
  display: block;
  width: 100%;
  margin-top: 0.6rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    border-color: #e3c987;
    color: #e3c987;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const ClearBtn = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.82rem;
  text-decoration: underline;
  padding: 0;
  margin-bottom: 0.5rem;
  &:hover {
    color: #fff;
  }
`;
