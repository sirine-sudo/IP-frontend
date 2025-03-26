import React from "react";

const CardContainer = ({ 
  children, 
  margin = "0", 
  width = "100%", 
  height = "auto", 
  display = "block", 
  alignItems = "stretch", 
  justifyContent = "flex-start", 
  flexDirection = "row", 
  boxShadow = "none" 
}) => {
  const containerStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "0.25em",
    margin,
    width,
    height,
    display,
    alignItems,
    justifyContent,
    flexDirection,
    boxShadow, // Optional for elevation effect
    overFlow:"hidden"
  };

  return <div style={containerStyle}>{children}</div>;
};

export default CardContainer;
