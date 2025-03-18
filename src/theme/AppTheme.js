import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#BED5EB", // Applique la couleur en fond global
    },
  },
});

export default function AppTheme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
