import { useState } from "react";
import { registerUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import * as React from "react";

import AppTheme from "../../theme/AppTheme";
import { validateEmail, validatePassword } from "../../utils/validation";
import AuthForm from "../../components/AuthComponents/AuthForm";
import AuthContainer from "../../components/AuthComponents/AuthContainer";
import AuthCard from "../../components/AuthComponents/AuthCard";

import { Box, Button, Checkbox, FormControlLabel, Link, Divider, Typography } from "@mui/material";
import TitleSection from "../../components/TitleSection";
import AppButton from "../../components/AppButton";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" ,role: "simple-user" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email format.";
    if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      await registerUser(formData);
      alert("Registration successful! Please log in.");
      navigate("/"); 

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <AppTheme>
      <AuthContainer>
        <AuthCard >
        <TitleSection title="Créez votre compte" text="Rejoignez-nous pour protéger et gérer votre propriété intellectuelle efficacement." />
            <Divider></Divider>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AuthForm
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
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
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
      

                        <AppButton
            
                          type="submit"
                          className="custom-button blue-primary-button-form"
            
                        >
                            Sign up
                        </AppButton>
            
            
          </Box>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account? <Link href="/"  
              className="Link"
            
            >Sign in</Link>
          </Typography>
        </AuthCard>
      </AuthContainer>
    </AppTheme>
  );
}
