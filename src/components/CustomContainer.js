import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const StyledContainer = styled(Box)(({ theme, maxWidth, height, padding, borderRadius, boxShadow, centered }) => ({
  width: "100%",
  maxWidth: maxWidth || "600px", // Default max width
  height: height || "auto",
  padding: padding || theme.spacing(4),
  margin: centered ? "auto" : undefined, // Centers the component if needed
  borderRadius: borderRadius || "30px",
  boxShadow: boxShadow || "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

const CustomContainer = ({ children, maxWidth, height, padding, borderRadius, boxShadow, centered }) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      height={height}
      padding={padding}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      centered={centered}
    >
      {children}
    </StyledContainer>
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
