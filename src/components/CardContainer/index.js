import React from "react";
import "./style.css";

const CardContainer = ({ 
  children, 
  margin, 
  width, 
  height, 
  display, 
  alignItems, 
  justifyContent, 
  flexDirection, 
  boxShadow 
}) => {
  const styles = {
    margin: margin || "10px",
    width: width || "100%",
    height: height || "auto",
    display: display || "block",
    alignItems: alignItems || "stretch",
    justifyContent: justifyContent || "flex-start",
    flexDirection: flexDirection || "row",
    boxShadow: boxShadow || "none",
  };

  return (
    <div className="card-container" style={styles}>
      {children}
    </div>
  );
};

export default CardContainer;
