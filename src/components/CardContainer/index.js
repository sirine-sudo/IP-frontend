import React from "react";
import "./style.css";

const CardContainer = ({ children }) => {
  return (
    <div className="card-container">
      {children}
    </div>
  );
};

export default CardContainer;
