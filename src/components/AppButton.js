import React from "react";
import Button from "@mui/material/Button";

const AppButton = ({
  children,
  variant = "contained", // Default variant
  color = "primary", // Default color
  startIcon,
  endIcon,
  onClick,
  width,
  fullWidth = false,
  size = "medium", // Small | Medium | Large
  disabled = false,
  sx = {}, // Custom styles if needed
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      fullWidth={fullWidth}
      size={size}
      width={width}
      disabled={disabled}
      sx={{
        textTransform: "none", // Keeps text in normal case
        borderRadius: "0.25em",
        padding: "8px 16px",
       
        ...sx, // Allow extra styles
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AppButton;
