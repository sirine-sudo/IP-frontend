import { useState } from "react";
import { loginUser } from "../../api/auth"; // API call
import { useNavigate, Link as RouterLink } from "react-router-dom";
import * as React from "react";
import { toast } from "react-toastify";

import AppTheme from "../../theme/AppTheme";
import { validateEmail, validatePassword } from "../../utils/validation";
import AuthForm from "../../components/AuthForm"; // Reusable input component
import AuthContainer from "../../components/AuthContainer"; // Page layout
import AuthCard from "../../components/AuthCard"; // Card container
import ForgotPassword from "./ForgotPassword"; // Forgot password modal

import { Box, Button, FormControlLabel, Checkbox, Link, Divider, Typography } from "@mui/material";
import TitleSection from "../../components/TitleSection";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Handles form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validates email & password
  const validateInputs = () => {
    let newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email format.";
    if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
  
    try {
      const res = await loginUser(formData); // res === { accessToken, refreshToken, role }
  
      if (res && res.accessToken && res.refreshToken) {
        // Stocker les tokens et le rôle
        localStorage.setItem("role", res.role);
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
  
        toast.success("Login successful! Redirecting...");
  
        setTimeout(() => {
          if (res.role === "admin") {
            navigate("/admin/users");  // 🔥 Redirect admins to the user list
          } else {
            navigate("/dashboard");    // 🔥 Normal users go to dashboard
          }
        }, 500);
        return res;
      } else {
        toast.error("Unexpected response. Please try again.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Try again.");
    }
  };
  
  
  return (
    <AppTheme>
      <AuthContainer>
        <AuthCard>
          <TitleSection title="S'authentifier" text="Connectez-vous pour gérer votre propriété intellectuelle en toute sécurité." />

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AuthForm
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <AuthForm
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Se souvenir de moi" />
            <Button type="submit" fullWidth variant="contained">
              Connexion
            </Button>
          </Box>
          <Divider>ou</Divider>
          <Typography sx={{ textAlign: "center" }}>
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" component={RouterLink}>
              Inscrivez-vous
            </Link>
          </Typography>
          <Typography sx={{ textAlign: "center", marginTop: "10px" }}>
            <Link
              type="button"
              component="button"
              onClick={(e) => {
                e.preventDefault();
                setOpenForgotPassword(true);
              }}
              variant="body2"
            >
              Mot de passe oublié ?
            </Link>
          </Typography>
        </AuthCard>
      </AuthContainer>

      {/*   Forgot Password Modal (Separate from Login Form) */}
      <ForgotPassword open={openForgotPassword} handleClose={() => setOpenForgotPassword(false)} />
    </AppTheme>
  );
}
