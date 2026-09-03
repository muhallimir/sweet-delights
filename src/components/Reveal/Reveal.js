import React from "react";
import { useReveal } from "../../hooks/useReveal";

const Reveal = ({ children, as: Tag = "div", className = "", id, ...rest }) => {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
