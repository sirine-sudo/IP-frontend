import { useState } from "react";

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
          "Authorization": `Bearer ${token}`,  // ✅ Assure-toi qu'il y a "Bearer "
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
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="title" placeholder="Titre" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <label>
  Pourcentage de royalties :
  <input
    type="number"
    name="royalty_percentage"
    value={formData.royalty_percentage || 0}
    onChange={(e) => setFormData({ ...formData, royalty_percentage: e.target.value })}
    min="0"
    max="100"
  />
</label>

      <select name="type" onChange={handleChange}>
        <option value="image">Image</option>
        <option value="audio">Audio</option>
        <option value="book">Livre</option>
      </select>

      <input type="file" name="file" onChange={handleFileChange} required />
      <button type="submit">Uploader & Protéger</button>
    </form>
  );
};

export default UploadForm;
