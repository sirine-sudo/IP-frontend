import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import MintNFT from "../../components/MintNFT";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import AppButton from "../../components/AppButton";

function Marketplace() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();

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

  // Handle the Mint NFT action and show an alert
  const handleMintNFT = async (fileUrl) => {
    setAlertMessage("Minting in progress... This will turn your digital asset into a unique NFT.");
    try {
      await MintNFT(fileUrl);
      setAlertMessage("NFT Minted Successfully! You can now trade or display your NFT.");
    } catch (error) {
      setAlertMessage("Minting failed. Please try again.");
    }
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1.5 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "owner_address", headerName: "Owner", flex: 1.5 },
    { field: "views", headerName: "Views", flex: 1, type: "number" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Eye Icon for Viewing the File */}
          <IconButton
            component="a"
            href={params.row.file_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View File"
          >
            <VisibilityIcon />
          </IconButton>

          {/* Mint NFT Button (Using AppButton) */}
          <AppButton
            onClick={() => handleMintNFT(params.row.file_url)}
            color="success"
          >
            Mint NFT
          </AppButton>
        </div>
      ),
    },
  ];

  const rows = ips.map((ip, index) => ({
    id: ip.id || index,
    title: ip.title,
    description: ip.description,
    type: ip.type || "N/A",
    owner_address: ip.owner_address || "Unknown",
    views: ip.views !== undefined ? ip.views : "N/A",
    file_url: ip.file_url,
  }));

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <CardContainer width="98%" height="95vh" margin="10px">
      <div style={{ padding: "20px" }}>
        {/* First Alert - Help Message */}
        {alertMessage && (
          <Alert
            severity="info"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 9999,
              width: 'auto', // Optional: Set the width as needed
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
          >
            Upload IP
          </AppButton>
        </div>

        <hr style={{ marginBottom: "20px" }} />

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={6} rowsPerPageOptions={[6]} />
        </div>
      </div>
    </CardContainer>
  );
}

export default Marketplace;
