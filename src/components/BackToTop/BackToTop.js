import React, { useEffect, useState } from "react";
import styled from "styled-components";

const TopBtn = styled.button`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 900;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(17, 17, 17, 0.9);
  color: #e3c987;
  font-size: 1.3rem;
  cursor: pointer;
  opacity: ${({ show }) => (show ? 1 : 0)};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  transform: translateY(${({ show }) => (show ? "0" : "8px")});
  transition: opacity 0.25s ease, transform 0.25s ease, background 0.2s ease;
  &:hover,
  &:focus-visible {
    background: #e3c987;
    color: #111;
  }
`;

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <TopBtn
      show={show}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
    >
      ↑
    </TopBtn>
  );
};

export default BackToTop;
