import styled from "styled-components";
import FeaturedPic from "../../images/featured.jpg";

export const FeatureContainer = styled.div`
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)),
    url(${FeaturedPic});
  height: 100vh;
  max-height: 500px;
  width: 100%;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  /* padding: 0 1rem; */

  h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    color: white;
  }
  p {
    margin-bottom: 1rem;
    font-size: clamp(1rem, 3vw, 2rem);
  }
`;

export const FeaturedButton = styled.button`
  font-size: 1.4rem;
  padding: 0.6rem 3rem;
  border: none;
  border-radius: 2rem;
  background: #d5af4c;
  color: #000;
  transition: 0.2s ease-out;

  &:hover {
    color: #000;
    background: #ffc500;
    border-radius: 2rem;
    transition: 0.2s ease-out;
    cursor: pointer;
  }
`;
