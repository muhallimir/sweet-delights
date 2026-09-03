import { Link } from "react-router-dom";
import styled from "styled-components";

export const FooterContainer = styled.footer`
  background-color: black;
  border-top: 1px solid rgba(227, 201, 135, 0.2);
`;
export const FooterWrap = styled.div`
  padding: 2.5rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  max-width: 1100px;
  margin: 0 auto;
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 2rem;
  width: 100%;
  margin-bottom: 1.5rem;
  @media screen and (max-width: 760px) {
    grid-template-columns: 1fr;
  }
  h3 {
    color: #e3c987;
    font-size: 1rem;
    margin: 0 0 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  p,
  address,
  li {
    font-size: 0.92rem;
    line-height: 1.7;
    opacity: 0.85;
    font-style: normal;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  a {
    color: #fff;
    text-decoration: none;
    &:hover,
    &:focus-visible {
      color: #e3c987;
      text-decoration: underline;
    }
  }
`;

export const SocialMedia = styled.section`
  max-width: 1300px;
  width: 100%;
`;

export const SocialMediaWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin: 16px auto 0 auto;

  @media screen and (max-width: 820px) {
    flex-direction: column;
  }
`;

export const SocialLogo = styled(Link)`
  color: #fff;
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: bold;
`;
export const SocialIcons = styled.div`
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  width: 240px; ;
`;

export const SocialIconLink = styled.a`
  color: #fff;
  font-size: 24px;
  &:hover,
  &:focus-visible {
    color: #e3c987;
  }
`;

export const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.82rem;
  opacity: 0.7;
`;
