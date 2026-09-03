import styled from "styled-components";
import ImgBg from "../../images/heroimg.jpg";

export const HeroContainer = styled.div`
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)),
    url(${ImgBg});
  height: 100vh;
  width: 100vw;
  background-position: center;
  background-size: cover;
`;

export const HeroContent = styled.div`
  height: calc(100vh - 80px);
  max-height: 100%;
  width: 100vw;
  padding: 0rem calc((100vw - 1300px) / 2);
`;

export const HeroItems = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  max-height: 100%;
  padding: 0 2rem;
  width: 650px;
  color: white;
  text-transform: uppercase;
  line-height: 1;
  font-weight: bold;

  @media screen and (max-width: 650px) {
    width: 100%;
  }
`;

export const HeroTitle = styled.div`
  font-size: clamp(2rem, 10vw, 5rem);
  margin-bottom: 1rem;
  box-shadow: 3px 5px 35px #e3c987;
  border-radius: 1rem;
  padding-left: 1rem;

  letter-spacing: 3px;
`;

export const HeroSub = styled.div`
  font-size: clamp(1.5rem, 2.5vw, 3rem);
  padding-left: 1rem;
  text-transform: capitalize;
  margin-bottom: 2rem;
`;

export const HeroBtn = styled.a`
  font-size: 1.4rem;
  padding: 1rem 4rem;
  margin-left: 1rem;
  border: none;
  background: #d5af4c;
  color: #010b13;
  cursor: pointer;
  transition: 0.2s ease-out;
  border-radius: 2rem;
  text-decoration: none;
  display: inline-block;

  &:hover,
  &:focus-visible {
    background: #ffc500;
    transition: 0.2s ease-out;
    color: #000;
    border-radius: 2rem;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;
