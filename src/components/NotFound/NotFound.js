import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.main`
  min-height: 70vh;
  background: #0d0d0d;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 1.25rem 4rem;
  h1 {
    font-size: clamp(3rem, 10vw, 5rem);
    color: #e3c987;
    margin: 0;
  }
  p {
    opacity: 0.8;
    margin: 0.6rem 0 1.4rem;
  }
  a {
    color: #111;
    background: #e3c987;
    border-radius: 999px;
    padding: 0.75rem 1.6rem;
    text-decoration: none;
    font-weight: 800;
    &:hover {
      background: #ffc500;
    }
  }
`;

const NotFound = () => (
  <Wrap>
    <h1>404</h1>
    <h2>Page not found</h2>
    <p>The treat you are looking for does not exist (yet).</p>
    <Link to="/">Back to home</Link>
  </Wrap>
);

export default NotFound;
