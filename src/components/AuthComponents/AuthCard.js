import { Card as MuiCard, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const StyledCard = styled(MuiCard)(({ theme, maxWidth, padding }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: maxWidth || "800px ", // Default max width
  padding: padding || theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
}));

const AuthCard = ({ title, children, maxWidth, padding }) => {
  return (
    <StyledCard variant="outlined" maxWidth={maxWidth} padding={padding}>
      <Typography component="h1" variant="h4" sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)", textAlign: "center" }}>
        {title}
      </Typography>
      {children}
    </StyledCard>
  );
};

AuthCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  padding: PropTypes.string,
};

export default AuthCard;
