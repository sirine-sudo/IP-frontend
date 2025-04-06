import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MintNFT from "../../components/MintNFT";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import AppButton from "../../components/AppButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./style.css";import { toast } from "react-toastify";

function Marketplace() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/ips";
  const itemsPerPage = 3; // 3 cards per page

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const res = await axios.get(`${API_URL}`);
        if (Array.isArray(res.data)) {
          const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
          setIps(sorted);
        } else {
          setIps([]);
        }
      } catch (err) {
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchIPs();
  }, []);

  const handleMintNFT = async (fileUrl, ipId) => {
    try {
      await MintNFT(fileUrl, ipId);
      setAlertMessage("✅ NFT Minté avec succès !");
    } catch {
      setAlertMessage("❌ Échec du mint.");
    }
  };

  const handleDeleteIP = async (id) => {
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cet IP ?")) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/ips/${id}`);
      setIps((prev) => prev.filter((ip) => ip.id !== id));
      toast.success(" IP supprimée avec succès !");

    } catch (error) {
      console.error(error);
      toast.error(" Échec de la suppression.");

    }
  };
  

  // Filtrer IPs selon recherche
  const filteredIps = ips.filter(
    (ip) =>
      ip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIps = filteredIps.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <CardContainer width="98%" height="auto" margin="10px">
      <div style={{ padding: "20px" }}>
        {alertMessage && (
          <Alert
            severity={alertMessage.includes("❌") ? "error" : "success"}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 9999,
              width: 'auto',
            }}
          >
            {alertMessage}
          </Alert>
        )}

        {/* Title & Upload Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <TitleSection
            title="Marché des Propriétés Intellectuelles"
            text="Explorez et échangez des actifs numériques en toute sécurité."
          />

          <AppButton
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/upload")}
            className="custom-button blue-primary-button"
          >
            Upload IP
          </AppButton>
        </div>

        {/* Search Bar */}
        <div style={{ margin: "20px 0" }}>
          <TextField
            label="Rechercher par titre ou description"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
          />
        </div>

        <hr style={{ marginBottom: "20px" }} />

        {/* Cards Layout */}
        <div className="ip-card-list">
          {currentIps.map((ip) => (
     <div
     key={ip.id}
     className="ip-card"
     onClick={() => {
       if (ip.nft_token_id === "pending") {
         navigate(`/ip/${ip.id}`); // 🔥 Clique vers détails SEULEMENT si ce n'est pas minté
       }
     }}
     style={{ cursor: ip.nft_token_id === "pending" ? "pointer" : "not-allowed" }}
   >
   
              {/* File Preview */}
              <div className="ip-card-file">
                {ip.type === "image" && <img src={ip.file_url} alt="IP" loading="lazy" className="file-preview" />}
                {ip.type === "video" && (
                  <video className="file-preview" controls muted>
                    <source src={ip.file_url} type="video/mp4" />
                  </video>
                )}
                {ip.type === "audio" && (
                  <audio className="file-audio" controls>
                    <source src={ip.file_url} type="audio/mp4" />
                  </audio>
                )}
              </div>

              {/* IP Info */}
              <div className="ip-card-info">
                <h3 className="ip-title">{ip.title}</h3>
                <p className="ip-description">{ip.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="ip-card-actions">
   <Button
  variant="contained"
  color="success"
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    handleMintNFT(ip.file_url, ip.id);
  }}
  disabled={ip.nft_token_id !== "pending"}
>
  Mint NFT
</Button>


                <Button
                  variant="contained"
                  color="warning"
                  className="edit-button"
                  size="small"
                  style={{ marginTop: "10px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/update-metadata/${ip.id}`);
                  }}
                >
                  Update Metadata
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  className="delete-button"
                  style={{ marginTop: "10px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIP(ip.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Précédent
          </Button>

          <Button
            variant="outlined"
            disabled={currentPage * itemsPerPage >= filteredIps.length}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Suivant
          </Button>
        </div>{alertMessage && (
  <Alert
    severity={alertMessage.includes("❌") ? "error" : "success"}
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      width: 'auto',
      transition: 'all 0.5s ease-in-out'
    }}
  >
    {alertMessage}
  </Alert>
)}

      </div>
    </CardContainer>
  );
}

export default Marketplace;
