import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import MintNFT from "../components/MintNFT";

function Marketplace() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const columns = [
    { field: "title", headerName: "Title", flex: 1.5 },
    { field: "description", headerName: "Description", flex: 3 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "owner_address", headerName: "Owner", flex: 1.5 },
    { field: "views", headerName: "Views", flex: 1, type: "number" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Bouton Voir le fichier */}
          <a href={params.row.file_url} target="_blank" rel="noopener noreferrer">
            <button>Voir le fichier</button>
          </a>
  
          {/* Bouton Mint NFT */}
          <button 
            onClick={() => MintNFT(params.row.file_url)} 
            style={{ cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
          >
            Mint NFT
          </button>
        </div>
      ),
    },
  ];
  
  // Assurez-vous que chaque ligne a un `id` unique dans `rows`
  const rows = ips.map((ip, index) => ({
    id: ip.id || index, // Si `ip.id` n'existe pas, utilise `index` comme id unique
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
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Marketplace</h2>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate("/upload")}
        >
          Upload IP
        </Button>
      </div>

      <hr style={{ marginBottom: "20px" }} />

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={6}
          rowsPerPageOptions={[6]}
        />
      </div>
    </div>
  );
}

export default Marketplace;
