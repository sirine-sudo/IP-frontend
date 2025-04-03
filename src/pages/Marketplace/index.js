import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Alert, Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import MintNFT from "../../components/MintNFT";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import AppButton from "../../components/AppButton";
import updateMetadata from "../../services/updateMetadata";

function Marketplace() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIP, setSelectedIP] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIPs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ips");
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
  

  const openMetadataDialog = (ip) => {
    setSelectedIP(ip);
    setFormData({
      name: ip.title,
      description: ip.description,
      image: ip.file_url,
      royalty_percentage: ip.royalty_percentage || 0,
    });
    setOpenDialog(true);
  };

  const handleMetadataSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/ips/metadata", formData);
      const newUri = res.data.uri;
      await updateMetadata(selectedIP.nft_token_id, newUri);
      setAlertMessage("✅ Metadonnées mises à jour !");
    } catch (err) {
      console.error(err);
      setAlertMessage("❌ Erreur de mise à jour.");
    } finally {
      setOpenDialog(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      flex: 2,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <IconButton
            component="a"
            href={params.row.file_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View File"
          >
            <VisibilityIcon />
          </IconButton>

          <AppButton
  onClick={() => handleMintNFT(params.row.file_url, params.row.id)}
  color="success"
>
  Mint NFT
</AppButton>


          <AppButton
            onClick={() => openMetadataDialog(params.row)}
            color="primary"
          >
            Update Metadata
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
    nft_token_id: ip.nft_token_id,
    royalty_percentage: ip.royalty_percentage,
  }));

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <CardContainer width="98%" height="95vh" margin="10px">
      <div style={{ padding: "20px" }}>
        {alertMessage && (
          <Alert
            severity="info"
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Modifier les métadonnées</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Nom"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Royalties (%)"
              name="royalty_percentage"
              value={formData.royalty_percentage}
              onChange={handleInputChange}
              type="number"
              margin="normal"
            />
            <Button onClick={handleMetadataSubmit} color="primary" variant="contained">
              Confirmer
            </Button>
          </DialogContent>
        </Dialog>

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
