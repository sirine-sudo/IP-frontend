import { useState } from "react";
import updateMetadata from "../../components/UpdateMetadata";
import axios from "axios";

const EditNFTForm = ({ tokenId, currentTitle, currentDescription, currentFileUrl }) => {
  const [formData, setFormData] = useState({
    title: currentTitle,
    description: currentDescription,
    file: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("⏳ Mise à jour en cours...");

    try {
      const data = new FormData();
      data.append("file", formData.file);

      const uploadRes = await axios.post("http://localhost:5000/api/pin-ipfs", data);
      const newCid = uploadRes.data.cid;

      // Générer nouveau fichier JSON (métadonnées)
      const metadata = {
        name: formData.title,
        description: formData.description,
        image: `ipfs://${newCid}`,
      };

      const jsonUploadRes = await axios.post("http://localhost:5000/api/pin-json", metadata);
      const newUri = `https://gateway.pinata.cloud/ipfs/${jsonUploadRes.data.cid}`;

      await updateMetadata(tokenId, newUri);
      setMessage("✅ NFT mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur lors de la mise à jour.");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="upload-form">
      <div className="form-container">
        <h3>Modifier le NFT #{tokenId}</h3>

        <label className="form-label">Nouveau titre :</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" />

        <label className="form-label">Nouvelle description :</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" />

        <label className="form-label">Nouveau fichier :</label>
        <input type="file" onChange={handleFileChange} className="form-file" required />

        <button type="submit" className="form-button">Mettre à jour le NFT</button>

        {message && <p style={{ marginTop: "10px", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
      </div>
    </form>
  );
};

export default EditNFTForm;
