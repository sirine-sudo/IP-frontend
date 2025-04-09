import { Box } from "@mui/material";
import PropTypes from "prop-types";
import "./CustomContainer.css";

const CustomContainer = ({ children, maxWidth, height, padding, borderRadius, boxShadow, centered }) => {
  const styles = {
    maxWidth: maxWidth || "600px",
    height: height || "auto",
    padding: padding || "32px",
    borderRadius: borderRadius || "30px",
    boxShadow: boxShadow || "0px 4px 10px rgba(0, 0, 0, 0.1)",
    margin: centered ? "0 auto" : undefined,
  };

  return (
    <Box className="custom-container" sx={styles}>
      {children}
    </Box>
  );
};

CustomContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  height: PropTypes.string,
  padding: PropTypes.string,
  borderRadius: PropTypes.string,
  boxShadow: PropTypes.string,
  centered: PropTypes.bool,
};

export default CustomContainer;
