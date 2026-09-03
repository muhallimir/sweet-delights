import styled from "styled-components";

export const NewsSection = styled.section`
  background: linear-gradient(135deg, #1a1408, #0f0f0f 60%);
  color: #fff;
  padding: 3.5rem 1.25rem;
  text-align: center;
  border-top: 1px solid rgba(227, 201, 135, 0.2);
  border-bottom: 1px solid rgba(227, 201, 135, 0.2);
  h2 {
    color: #e3c987;
    margin: 0 0 0.4rem;
    font-size: clamp(1.6rem, 3.5vw, 2.1rem);
  }
  p {
    opacity: 0.8;
    margin: 0 auto 1.4rem;
    max-width: 560px;
    line-height: 1.6;
  }
`;

export const Form = styled.form`
  display: flex;
  gap: 0.6rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 560px;
  margin: 0 auto;
  input {
    flex: 1 1 260px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: #0c0c0c;
    color: #fff;
    padding: 0.75rem 1.1rem;
    font-size: 1rem;
    &:focus {
      outline: 2px solid #e3c987;
      border-color: #e3c987;
    }
  }
  button {
    border: none;
    border-radius: 999px;
    background: #d5af4c;
    color: #111;
    font-weight: 800;
    padding: 0.75rem 1.6rem;
    cursor: pointer;
    &:hover,
    &:focus-visible {
      background: #ffc500;
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  }
`;

export const Msg = styled.p`
  margin-top: 0.9rem;
  font-size: 0.92rem;
  color: ${({ error }) => (error ? "#ff9a9a" : "#c8f0d2")};
`;
