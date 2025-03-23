import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "../components/UploadForm";

function Marketplace() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ips");
        console.log("Données reçues :", res.data);
        if (Array.isArray(res.data)) {
          setIps(res.data);
        } else {
          throw new Error("Données inattendues");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des IPs :", err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchIPs();
  }, []);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Marketplace</h2>
      <UploadForm />
      {ips.length === 0 ? (
        <p>Aucune propriété intellectuelle trouvée.</p>
      ) : (
        ips.map((ip) => (
          <div key={ip.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
            <h3>{ip.title}</h3>
            <p><strong>Type :</strong> {ip.type || "Non spécifié"}</p>
            <p><strong>Auteur :</strong> {ip.owner_address || "Inconnu"}</p>
            <p><strong>Vues :</strong> {ip.views !== undefined ? ip.views : "Non disponible"}</p>
            <p>
              <strong>Lien IPFS :</strong>{" "}
              <a href={ip.file_url} target="_blank" rel="noopener noreferrer">
                Voir le fichier
              </a>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Marketplace;
