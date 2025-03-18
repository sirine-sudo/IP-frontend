import { useState } from "react";
import { forgotPassword } from "../../api/auth"; // API call
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  OutlinedInput,
} from "@mui/material";
import TitleSection from "../../components/TitleSection";

export default function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleForgotPassword = async (event) => {
    event.preventDefault(); //  Prevents login submission

    setError("");
    setSuccessMessage("");

    if (!email.includes("@") || !email.includes(".")) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      await forgotPassword(email);
      setSuccessMessage("Lien de réinitialisation envoyé ! Vérifiez votre email.");
      setTimeout(() => {
        setSuccessMessage("");
        handleClose(); //  Closes modal after success
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Échec de l'envoi du lien.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleForgotPassword} style={{ padding: "20px" }}> {/*  Prevents form submitting login */}
        <TitleSection
          title="Réinitialiser le mot de passe"
          text="Entrez votre email et nous vous enverrons un lien de réinitialisation."
        />
        <DialogContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "40px",  //  Proper padding
            overflow: "hidden", //  Prevents unnecessary scrolling
          }}
        >
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            placeholder="Adresse email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
              {error}
            </p>
          )}
          {successMessage && (
            <p style={{ color: "green", fontSize: "14px", textAlign: "center" }}>
              {successMessage}
            </p>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: "20px" }}> {/*  Added padding */}
          <Button onClick={handleClose} variant="outlined">
            Annuler
          </Button>
          <Button variant="contained" type="submit">
            Continuer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
