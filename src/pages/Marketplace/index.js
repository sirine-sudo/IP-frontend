import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MintNFT from "../../components/MintNFT";
import updateMetadata from "../../services/updateMetadata";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import AppButton from "../../components/AppButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./style.css";

function Marketplace() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/ips";
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; //  how many cards per page

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const res = await axios.get(`${API_URL}`);
        setIps(Array.isArray(res.data) ? res.data : []);
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
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet IP ?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setIps((prev) => prev.filter((ip) => ip.id !== id));
      setAlertMessage("✅ IP supprimée !");
    } catch {
      setAlertMessage("❌ Échec de la suppression.");
    }
  };

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <CardContainer width="98%" height="82vh" margin="10px">
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

        <hr style={{ marginBottom: "20px" }} />

        {/* Cards Layout */}
        <div className="ip-card-list">
          {ips
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((ip) => (

              <div
               key={ip.id} className="ip-card"
               onClick={() => navigate(`/ip/${ip.id}`)} //  Click to go to IP details
               style={{ cursor: "pointer" }} //  Change cursor to pointer
               
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
    className="view-button"
    size="small"
    onClick={(e) => {
      e.stopPropagation(); // 🔥 Stop click propagation
      handleMintNFT(ip.file_url, ip.id); // ✅ Call your MintNFT function
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
      e.stopPropagation(); // 🔥 VERY IMPORTANT
      // Here you should call your updateMetadata function
      console.log('Update metadata clicked for', ip.id);
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
      e.stopPropagation(); // 🔥 VERY IMPORTANT
      handleDeleteIP(ip.id); // ✅ Call your delete function
    }}
  >
    Delete
  </Button>
</div>

              </div>
            ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
  <Button
    variant="outlined"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
  >
    Previous
  </Button>

  <Button
    variant="outlined"
    disabled={currentPage * itemsPerPage >= ips.length}
    onClick={() => setCurrentPage((prev) => prev + 1)}
  >
    Next
  </Button>
</div>

      </div>
    </CardContainer>
  );
}

export default Marketplace;
