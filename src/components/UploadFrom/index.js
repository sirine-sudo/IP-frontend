import { useState } from "react";
import "./style.css";
import AppButton from "../../components/AppButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken"); // 🔥 Récupérer le refresh token
    
    if (!refreshToken) return null; // Pas de refresh token, retourne null
  
    try {
      const response = await fetch("http://localhost:5000/api/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) throw new Error("Échec du rafraîchissement du token");
  
      const data = await response.json();
      localStorage.setItem("token", data.accessToken); // Stocke le nouveau token
      return data.accessToken;
    } catch (error) {
      console.error("Erreur lors du refresh token :", error);
      return null;
    }
  };const handleSubmit = async (e) => {
    e.preventDefault();
  
    let token = localStorage.getItem("token");
  
    if (!token) {
      console.log("Token expiré, tentative de rafraîchissement...");
      token = await refreshAccessToken();  // 🔥 Rafraîchir le token si expiré
    }
  
    if (!token) {
      console.error("⚠️ Impossible de récupérer un token valide.");
      return;
    }
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("file", formData.file);
  
    try {
      const response = await fetch("http://localhost:5000/api/ips", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,  //  Assure-toi qu'il y a "Bearer "
        },
        body: data,
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur lors de l'upload : ${errorMessage}`);
      }
  
      const responseData = await response.json();
      console.log("Succès :", responseData);
    } catch (error) {
      console.error("Erreur :", error.message);
    }
  };
  

  return (
<form onSubmit={handleSubmit} encType="multipart/form-data" className="upload-form">
  <div className="upload-wrapper">
    
    {/* Partie droite (Formulaire) */}
    <div className="form-container">
      <label className="form-label">Titre :</label>
      <input type="text" name="title" placeholder="Titre" onChange={handleChange} required className="form-input" />

      <label className="form-label">Description :</label>
      <textarea name="description" placeholder="Description" onChange={handleChange} required className="form-textarea" />

      <label className="form-label">Pourcentage de royalties :</label>
      <input
        type="number"
        name="royalty_percentage"
        value={formData.royalty_percentage || 0}
        onChange={(e) => setFormData({ ...formData, royalty_percentage: e.target.value })}
        min="0"
        max="100"
        className="form-input"
      />

      <label className="form-label">Type de fichier :</label>
      <select name="type" onChange={handleChange} className="form-select">
        <option value="image">Image</option>
        <option value="audio">Audio</option>
        <option value="book">Livre</option>
      </select>

      <label className="form-label">Fichier :</label>
      <input type="file" name="file" onChange={handleFileChange} required className="form-file" />

      <AppButton
        startIcon={<AddRoundedIcon />}
        type="submit"
        className="custom-button blue-primary-button-form"
      >
        Upload IP
      </AppButton>
    </div>

    {/* Partie gauche (uploaded file info) */}
    <div className="uploaded-file-info">
      hello the uploaded file is here
    </div>

  </div>
</form>


  );
};

export default UploadForm;
