import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

export default function AppTheme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
