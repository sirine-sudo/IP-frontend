import { useState } from "react";
import { loginUser } from "../../api/auth"; // API call
import { useNavigate, Link as RouterLink } from "react-router-dom";
import * as React from "react";
import { toast } from "react-toastify";
import AppButton from "../../components/AppButton";

import AppTheme from "../../theme/AppTheme";
import { validateEmail, validatePassword } from "../../utils/validation";
import AuthForm from "../../components/AuthComponents/AuthForm"; // Reusable input component
import AuthContainer from "../../components/AuthComponents/AuthContainer"; // Page layout
import AuthCard from "../../components/AuthComponents/AuthCard"; // Card container
import ForgotPassword from "./ForgotPassword"; // Forgot password modal
import './style.css'

import { Box,  FormControlLabel, Checkbox, Link, Divider, Typography } from "@mui/material";
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
      const res = await loginUser(formData);
  
      if (res && res.accessToken && res.refreshToken) {
        localStorage.setItem("role", res.role);
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
  
        toast.success("Connexion réussie ! Redirection...");
  
        setTimeout(() => {
          if (res.role === "admin") {
            navigate("/admin/users");
          } else {
            navigate("/dashboard");
          }
        }, 500);
        return res;
      } else {
        toast.error("Réponse inattendue. Réessayez.");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
  
        if (errorMessage.includes("User not found")) {
          toast.error("Utilisateur non trouvé !");
        } else if (errorMessage.includes("Incorrect password")) {
          toast.error("Mot de passe incorrect !");
        } else {
          toast.error(errorMessage || "Erreur lors de la connexion.");
        }
      } else {
        toast.error("Erreur réseau. Vérifiez votre connexion.");
      }
    }
  };
  

  return (
    <AppTheme>
      <AuthContainer  >
        <AuthCard>
          <TitleSection title="Connexion" text="Connectez-vous pour gérer votre propriété intellectuelle en toute sécurité." />
            <Divider></Divider>
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
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Se souvenir de moi" />

            <AppButton

              type="submit"
              className="custom-button blue-primary-button-form"

            >
              Connexion
            </AppButton>



          </Box>
          <Divider>ou</Divider>
          <Typography sx={{ textAlign: "center" }}>
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" 
              className="Link"
            
            component={RouterLink}>
              Inscrivez-vous
            </Link>
          </Typography>
          <Typography sx={{ textAlign: "center", marginTop: "10px" }}>
            <Link
              className="Link"
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
