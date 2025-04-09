import React from "react";
import "./style.css";

const CardContainer = ({ children, className = "" }) => {
  return (
    <div className={`card-container ${className}`}>
      {children}
    </div>
  );
};

export default CardContainer;
