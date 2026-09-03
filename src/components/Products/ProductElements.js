import styled from "styled-components";
import ImgBg from "../../images/bgprod.jpg";

export const ProductContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1)),
    url(${ImgBg});
  padding: 5rem clamp(1rem, 4vw, calc((1300px - 100%) / 2));
  color: #fff;
  box-sizing: border-box;
`;

export const ProductWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
`;

export const ProductCard = styled.div`
  margin: 0 1rem;
  padding-bottom: 50px;
  line-height: 2;
  width: 300px;
  max-width: 100%;
  box-sizing: border-box;
  @media screen and (max-width: 480px) {
    width: 100%;
    margin: 0;
  }
`;

export const ProductImg = styled.img`
  height: 300px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  /* box-shadow: 8px 8px #fdc500; */
  box-shadow: 3px 5px 35px #e3c987;
  &:hover {
    transform: scale(1.1);
    transition: 0.25s ease-in;
  }
`;

export const ProductHeading = styled.h1`
  font-size: clamp(2rem, 2.5vw, 2.5rem);
  text-align: center;
  margin-bottom: 5rem;
`;

export const ProductTitle = styled.h2`
  font-weight: 400;
  text-align: center;
  color: #e3c987;
  font-size: 1.5rem;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ProductDesc = styled.p`
  margin-bottom: 1rem;
  text-align: center;
`;

export const ProductPrice = styled.p`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

export const ProductButton = styled.button`
  font-size: 1rem;
  padding: 1rem 4rem;
  border: none;
  border-radius: 2rem;
  background: #d5af4c;
  color: #010b13;
  transition: 0.2 ease-out;

  &:hover {
    background: #ffc500;
    transition: 0.2s ease-out;
    color: #000;
    border-radius: 2rem;
    cursor: pointer;
  }
`;
