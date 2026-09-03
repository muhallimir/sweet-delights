import styled from "styled-components";

export const CaterSection = styled.section`
  background: #0d0d0d;
  color: #fff;
  padding: 4.5rem 1.25rem;
`;

export const CaterInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  h2 {
    text-align: center;
    color: #e3c987;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    margin: 0 0 0.4rem;
  }
  .sub {
    text-align: center;
    opacity: 0.78;
    margin: 0 0 2rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.5rem;
  @media screen and (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #151515;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
`;

export const Field = styled.div`
  margin-bottom: 0.95rem;
  label {
    display: block;
    font-size: 0.88rem;
    margin-bottom: 0.3rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    border-radius: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: #0c0c0c;
    color: #fff;
    padding: 0.7rem 0.9rem;
    font-size: 0.98rem;
    &:focus {
      outline: 2px solid #e3c987;
      border-color: #e3c987;
    }
  }
`;

export const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  @media screen and (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Err = styled.p`
  color: #ff9a9a;
  font-size: 0.83rem;
  margin: 0.3rem 0 0;
`;

export const SubmitBtn = styled.button`
  width: 100%;
  background: #d5af4c;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  font-weight: 800;
  cursor: pointer;
  color: #111;
  &:hover,
  &:focus-visible {
    background: #ffc500;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 1.2rem;
  transform: translateX(-50%);
  background: #14351f;
  border: 1px solid #2f7a44;
  color: #dff5e5;
  border-radius: 999px;
  padding: 0.8rem 1.4rem;
  z-index: 1200;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  font-size: 0.95rem;
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  strong {
    color: #e3c987;
  }
`;
