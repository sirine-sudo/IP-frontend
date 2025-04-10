import { useState } from "react";
import AppButton from "../AppButton";
import { uploadIP } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CloudUpload } from "lucide-react";
import styles from "./style.module.css"; // ✅ CSS Modules

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image",
    file: null,
    royalty_percentage: 0,
    is_for_sale: "false",
    price: "",
    preferred_creator_name: "",
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
      toast.success("Upload réussi !");
      navigate("/marketplace");
      console.log("Succès :", response);
    } catch (error) {
      toast.error(`Erreur : ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.uploadForm}>
      <div className={styles.uploadWrapper}>

        {/* Ligne 1: Titre | Créateur */}
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.formLabel}>Titre :</label>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formColumn}>
            <label className={styles.formLabel}>Nom du créateur :</label>
            <input
              type="text"
              name="preferred_creator_name"
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
        </div>

        {/* Ligne 2: Description seule */}
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.formLabel}>Description :</label>
            <textarea
              name="description"
              onChange={handleChange}
              required
              className={styles.formTextarea}
            />
          </div>
        </div>

        {/* Ligne 3: Type de fichier | Upload fichier */}
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.formLabel}>Type de fichier :</label>
            <select
              name="type"
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Vidéo</option>
              <option value="book">Livre</option>
            </select>
          </div>

          <div className={styles.formColumn}>
            <label className={styles.formLabel}>Fichier :</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
              className={styles.formFile}
            />
          </div>
        </div>

        {/* Ligne 4: Royalties | Vente | Prix */}
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.formLabel}>Pourcentage de royalties :</label>
            <input
              type="number"
              name="royalty_percentage"
              value={formData.royalty_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formColumn}>
            <label className={styles.formLabel}>Mettre en vente ?</label>
            <select
              name="is_for_sale"
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="false">Non</option>
              <option value="true">Oui</option>
            </select>

            {formData.is_for_sale === "true" && (
              <>
                <label className={styles.formLabel}>Prix (ETH) :</label>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  className={styles.formInput}
                  min="0"
                  step="0.01"
                />
              </>
            )}
          </div>
        </div>

        {/* Bouton Upload */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <AppButton
            startIcon={<CloudUpload />}
            type="submit"
            className={`${styles.customButton} ${styles.bluePrimaryButtonForm}`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload IP"}
          </AppButton>
        </div>

        {/* Message succès/erreur */}
        {message && (
          <div className={`${styles.uploadMessage} ${message.startsWith("✅") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

      </div>
    </form>
  );
};

export default UploadForm;
