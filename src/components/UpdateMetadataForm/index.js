import { useState, useEffect } from "react";
import "./style.css";
import AppButton from "../AppButton";
import { updateIPMetadata } from "../../services/api";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";

const UpdateMetadataForm = () => {

  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    file_url: "",
    royalty_percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ips/${id}`);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          type: response.data.type,
          file_url: response.data.file_url,
          royalty_percentage: response.data.royalty_percentage,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchIP();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateIPMetadata(id, {
        title: formData.title,
        description: formData.description,
        royalty_percentage: formData.royalty_percentage,
      });
      toast.success(" Métadonnées mises à jour !");
      navigate("/marketplace");
      
    } catch (error) {
        toast.error(" Erreur pendant la mise à jour");

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="upload-wrapper">
        <div className="form-container">
          <label className="form-label">Titre :</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />

          <label className="form-label">Description :</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-textarea"
          />

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

          <label className="form-label">Type :</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            disabled
            className="form-input"
          />

          <label className="form-label">Fichier :</label>
          <input
            type="text"
            name="file_url"
            value={formData.file_url}
            disabled
            className="form-file"
          />

          <AppButton
            type="submit"
            className="custom-button blue-primary-button-form"
            disabled={loading}
          >
            {loading ? "Updating..." : "Mettre à jour"}
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
          {formData.type === "image" && (
            <img src={formData.file_url} alt="Preview" style={{ maxWidth: "100%", maxHeight: "400px" }} />
          )}
          {formData.type === "audio" && (
            <audio controls src={formData.file_url} style={{ width: "100%" }} />
          )}
          {formData.type === "video" && (
            <video controls src={formData.file_url} style={{ maxWidth: "100%", maxHeight: "400px" }} />
          )}
          {formData.type === "book" && <p>Document: {formData.file_url}</p>}
        </div>
      </div>
    </form>
  );
};

export default UpdateMetadataForm;
