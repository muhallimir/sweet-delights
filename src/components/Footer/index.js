import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import {
  FooterContainer,
  FooterWrap,
  FooterGrid,
  SocialMedia,
  SocialMediaWrap,
  SocialLogo,
  SocialIcons,
  SocialIconLink,
  BottomBar,
} from "./FooterElements";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrap>
        <FooterGrid>
          <div>
            <h3>Sweet Delights</h3>
            <p>
              Homemade sweets and snack treats, baked fresh daily. COD and GCash
              accepted. Free delivery on orders ₱500+.
            </p>
            <p style={{ marginTop: ".6rem" }}>
              <Link to="/checkout">Checkout</Link> ·{" "}
              <a href="#menu">Menu</a> · <a href="#catering">Catering</a>
            </p>
          </div>
          <div>
            <h3>Opening hours</h3>
            <ul>
              <li>Mon – Sat: 8:00 AM – 8:00 PM</li>
              <li>Sunday: 9:00 AM – 6:00 PM</li>
              <li>Fiesta bulk orders: 2 days lead time</li>
            </ul>
          </div>
          <div>
            <h3>Find us</h3>
            <address>
              Poblacion, Philippines
              <br />
              <a href="tel:+639171234567">0917 123 4567</a>
              <br />
              <a href="mailto:hello@sweetdelights.ph">
                hello@sweetdelights.ph
              </a>
            </address>
          </div>
        </FooterGrid>
        <SocialMedia>
          <SocialMediaWrap>
            <SocialLogo to="/">Sweet Delights</SocialLogo>
            <SocialIcons>
              <SocialIconLink
                href="https://facebook.com"
                target="_blank"
                aria-label="Sweet Delights on Facebook"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </SocialIconLink>
              <SocialIconLink
                href="https://instagram.com"
                target="_blank"
                aria-label="Sweet Delights on Instagram"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </SocialIconLink>
              <SocialIconLink
                href="https://youtube.com"
                target="_blank"
                aria-label="Sweet Delights on YouTube"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </SocialIconLink>
              <SocialIconLink
                href="https://twitter.com"
                target="_blank"
                aria-label="Sweet Delights on Twitter"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </SocialIconLink>
            </SocialIcons>
          </SocialMediaWrap>
        </SocialMedia>
        <BottomBar>
          <span>© {new Date().getFullYear()} Sweet Delights. All rights reserved.</span>
          <span>Made fresh daily · Mock demo storefront</span>
        </BottomBar>
      </FooterWrap>
    </FooterContainer>
  );
};

export default Footer;
