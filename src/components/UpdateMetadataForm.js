import React, { useState } from "react";
import axios from "axios";
import updateMetadata from "../services/updateMetadata";

export default function UpdateMetadataForm({ ip }) {
  const [formData, setFormData] = useState({
    name: ip.title,
    description: ip.description,
    image: ip.file_url,
    royalty_percentage: ip.royalty_percentage || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // ✅ 1. Check si le NFT a bien été minté
      if (!ip.nft_token_id || ip.nft_token_id === "pending") {
        alert("❌ Ce NFT n’a pas encore été minté.");
        return;
      }
  
      // ✅ 2. Envoi du JSON vers IPFS
      const res = await axios.post(
        "http://localhost:5000/api/ips/metadata",
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (!res.data || !res.data.cid) {
        console.error("❌ CID manquant :", res.data);
        alert("Impossible de récupérer le CID IPFS.");
        return;
      }
  
      const ipfsCid = res.data.cid;
      const newUri = `ipfs://${ipfsCid}`;
      console.log("✅ URI générée :", newUri);
  
      // ✅ 3. Mise à jour dans le smart contract
      await updateMetadata(ip.nft_token_id, newUri);
  
      alert("✅ NFT mis à jour avec succès !");
    } catch (err) {
      console.error("❌ Erreur lors de la mise à jour :", err);
      alert("Erreur lors de la mise à jour des métadonnées.");
    }
  };
  
  return (
    <div style={{ padding: 20 }}>
      <h3>Modifier les métadonnées du NFT</h3>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" /><br />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" /><br />
      <input type="number" name="royalty_percentage" value={formData.royalty_percentage} onChange={handleChange} placeholder="Royalty %" /><br />
      <button onClick={handleUpdate}>Mettre à jour les métadonnées</button>
    </div>
  );
}
