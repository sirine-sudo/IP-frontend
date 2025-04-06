import { useState } from "react";
import "./style.css";
import AppButton from "../AppButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { uploadIP } from "../../services/api";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image",
    file: null,
    royalty_percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await uploadIP(formData);
            toast.success(" Upload réussi !");
      
      navigate("/marketplace"); 

      console.log("Succès :", response);
    } catch (error) {
      toast.error(` Erreur : ${error.message}`);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="upload-form">
      <div className="upload-wrapper">
        <div className="form-container">
          {/* Tous les inputs */}
          <label className="form-label">Titre :</label>
          <input type="text" name="title" onChange={handleChange} required className="form-input" />

          <label className="form-label">Description :</label>
          <textarea name="description" onChange={handleChange} required className="form-textarea" />

          <label className="form-label">Pourcentage de royalties :</label>
          <input
            type="number"
            name="royalty_percentage"
            value={formData.royalty_percentage}
            onChange={handleChange}
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
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload IP"}
          </AppButton>
          {message && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: message.startsWith("✅") ? "#d4edda" : "#f8d7da",
                color: message.startsWith("✅") ? "#155724" : "#721c24",
                border: message.startsWith("✅") ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
                fontWeight: "bold",
              }}
            >
              {message}
            </div>
          )}


        </div>

        <div className="uploaded-file-info">
          hello the uploaded file is here
        </div>
      </div>
    </form>
  );
};

export default UploadForm;
