import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/uploadIp";
import Marketplace from "./pages/Marketplace";
import Navbar from "./components/Navbar";
import AudioLyricsEditor from "./pages/AudioLyricsEditor";

// Define or import the theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#BED5EB", // Set background color here
    },
  },
});

// Layout component to handle Navbar visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const authPages = ["/", "/register", "/forgot-password", "/reset-password"];
  
  return (
    <>
      {!authPages.includes(location.pathname) && <Navbar />}
      <main>{children}</main>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Authentication Pages (No Navbar) */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Pages with Navbar */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/audioLyricsEditor" element={<AudioLyricsEditor />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
