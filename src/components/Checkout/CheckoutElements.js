import styled from "styled-components";

export const CheckoutWrap = styled.main`
  min-height: 100vh;
  background: #0d0d0d;
  color: #fff;
  padding: 6rem 1.25rem 4rem;
`;

export const CheckoutInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  @media screen and (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.section`
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
`;

export const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  color: #e3c987;
  margin: 0 0 0.4rem;
`;

export const Sub = styled.p`
  opacity: 0.8;
  margin: 0 0 1.25rem;
`;

export const Field = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.35rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    border-radius: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: #0f0f0f;
    color: #fff;
    padding: 0.75rem 0.9rem;
    font-size: 1rem;
    &:focus {
      outline: 2px solid #e3c987;
      outline-offset: 1px;
      border-color: #e3c987;
    }
  }
  textarea {
    min-height: 90px;
    resize: vertical;
  }
`;

export const ErrorText = styled.p`
  color: #ff9a9a;
  font-size: 0.85rem;
  margin: 0.3rem 0 0;
`;

export const RadioGroup = styled.div`
  display: grid;
  gap: 0.6rem;
  label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 0.7rem;
    padding: 0.7rem 0.9rem;
    cursor: pointer;
  }
  input {
    width: auto;
    accent-color: #e3c987;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 0.95rem;
`;

export const TotalRow = styled(SummaryRow)`
  font-size: 1.15rem;
  font-weight: 800;
  color: #e3c987;
  border-bottom: none;
`;

export const PlaceOrderBtn = styled.button`
  width: 100%;
  margin-top: 1rem;
  background: #d5af4c;
  color: #111;
  font-weight: 800;
  font-size: 1.05rem;
  border: none;
  border-radius: 999px;
  padding: 0.9rem 1rem;
  cursor: pointer;
  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: #ffc500;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 1.25rem;
  color: #e3c987;
  text-decoration: none;
  &:hover,
  &:focus-visible {
    text-decoration: underline;
    outline: 2px solid #e3c987;
    outline-offset: 2px;
  }
`;

export const SuccessBadge = styled.div`
  background: #14351f;
  border: 1px solid #2f7a44;
  color: #c8f0d2;
  border-radius: 0.9rem;
  padding: 1rem 1.2rem;
  margin-bottom: 1.25rem;
`;

export const OrderId = styled.p`
  font-size: 1.3rem;
  font-weight: 800;
  color: #e3c987;
  margin: 0.4rem 0;
`;
