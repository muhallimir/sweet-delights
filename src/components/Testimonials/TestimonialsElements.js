import styled from "styled-components";

export const TestiSection = styled.section`
  background: #0f0f0f;
  color: #fff;
  padding: 4.5rem 1.25rem;
  text-align: center;
  h2 {
    color: #e3c987;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    margin: 0 0 0.4rem;
  }
  .sub {
    opacity: 0.75;
    margin: 0 0 2rem;
  }
`;

export const Card = styled.blockquote`
  max-width: 680px;
  margin: 0 auto;
  background: #171717;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.1rem;
  padding: 2rem 1.6rem 1.6rem;
  min-height: 210px;
  .stars {
    color: #ffc500;
    letter-spacing: 2px;
    margin-bottom: 0.8rem;
  }
  p.quote {
    font-size: 1.1rem;
    line-height: 1.65;
    margin: 0 0 1rem;
  }
  footer {
    opacity: 0.8;
    font-size: 0.92rem;
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  margin-top: 1.25rem;
`;

export const ArrowBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  &:hover,
  &:focus-visible {
    background: #e3c987;
    color: #111;
    border-color: #e3c987;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

export const Dots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${({ active }) => (active ? "#e3c987" : "rgba(255,255,255,.28)")};
  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;
