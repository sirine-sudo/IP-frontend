import { useState } from "react";
import { loginUser } from "../../api/auth";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import AppButton from "../../components/AppButton";
import AppTheme from "../../theme/AppTheme";
import { validateEmail, validatePassword } from "../../utils/validation";
import AuthForm from "../../components/AuthComponents/AuthForm";
import AuthContainer from "../../components/AuthComponents/AuthContainer";
import AuthCard from "../../components/AuthComponents/AuthCard";
import ForgotPassword from "./ForgotPassword";
import './style.css';
import { Box, FormControlLabel, Checkbox, Link, Divider, Typography } from "@mui/material";
import TitleSection from "../../components/TitleSection";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await loginUser(formData);
    
      if (res?.accessToken && res?.refreshToken) {
        localStorage.setItem("role", res.role);
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);

        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate(res.role === "admin" ? "/admin/users" : "/dashboard"), 500);
      } else {
        toast.error("Unexpected response. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Network error. Please check your connection.";
      
      if (errorMessage.includes("User not found")) {
        toast.error("User not found!");
      } else if (errorMessage.includes("Incorrect password")) {
        toast.error("Incorrect password!");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <AppTheme>
      <AuthContainer>
        <AuthCard>
          <TitleSection 
            title="Login" 
            text="Sign in to manage your intellectual property securely." 
          />
          <Divider />
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AuthForm
              className="text-input"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <AuthForm
              className="text-input"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            
            <FormControlLabel 
              control={<Checkbox value="remember" color="primary" />} 
              label="Remember me" 
            />

            <AppButton type="submit" className="custom-button blue-primary-button-form">
              Sign In
            </AppButton>
          </Box>
          
          <Divider>or</Divider>
          
          <Typography sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register" className="Link" component={RouterLink}>
              Sign Up
            </Link>
          </Typography>
          
          <Typography sx={{ textAlign: "center", mt: "10px" }}>
            <Link
              className="Link"
              component="button"
              onClick={() => setOpenForgotPassword(true)}
              variant="body2"
            >
              Forgot password?
            </Link>
          </Typography>
        </AuthCard>
      </AuthContainer>

      <ForgotPassword 
        open={openForgotPassword} 
        handleClose={() => setOpenForgotPassword(false)} 
      />
    </AppTheme>
  );
}