import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button, IconButton, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MintNFT from "../../components/MintNFT";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./style.css";
import { toast } from "react-toastify";
import { FaFilePdf } from "react-icons/fa";
import { ChevronLeft, Edit, ChevronRight, Trash } from "lucide-react";

function Marketplace() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
   const connectedWalletAddress = "0xCfa5C9015dd6949d1913AD58Df99e6a7A82BfFCF";
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/ips";
  const itemsPerPage = 8; // 3 cards per page
  const handlePutOnSale = async (ipId) => {
    const price = prompt("Prix de vente en ETH :"); // 🔥 Demander le prix
    if (!price) return;

    try {
      await axios.put(`http://localhost:5000/api/ips/${ipId}/sale`, { is_for_sale: true, price });
      toast.success("IP mise en vente !");
      window.location.reload(); // 🔥 Simple, recharger la page
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise en vente.");
    }
  };
  const handleBuyIP = (ipId) => {
    const confirmWallet = window.confirm("🔔 Connecter votre portefeuille pour acheter cette IP ?");
    if (!confirmWallet) return;

    const confirmBuy = window.confirm(
      "✅ Confirmez-vous l'achat de cette IP numérique ?\n\n" +
      "En validant, vous deviendrez officiellement le propriétaire de cet actif.\n" +
      "Le transfert de propriété sera effectué automatiquement vers votre portefeuille connecté.\n\n"
      
    );
        if (!confirmBuy) return;

    toast.success(" Achat  avec succès !");
    
    setIps((prevIps) =>
      prevIps.map((ip) =>
        ip.id === ipId
          ? { ...ip, is_for_sale: false, owner_address: connectedWalletAddress } // Adresse simulée
          : ip
      )
    );
  };
  
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
  const [selectedType, setSelectedType] = useState("");
  const [onlyForSale, setOnlyForSale] = useState(false);

  const handleMintNFT = async (fileUrl, ipId) => {

    await MintNFT(fileUrl, ipId);

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
  const filteredIps = ips.filter((ip) => {
    const matchesSearch = ip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ip.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? ip.type === selectedType : true;
    const matchesSale = onlyForSale ? ip.is_for_sale : true;
    return matchesSearch && matchesType && matchesSale;
  });


  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIps = filteredIps.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <CardContainer ></CardContainer>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <CardContainer  >
      <div>
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
          <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "space-between", marginBottom: "20px"  ,width:"90vh",}}>
            {/* Search Text */}
            <TextField
              label="Rechercher..."
              variant="standard"
              className="search-bar"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ flex: 2 }} // 🔥 occupe plus d’espace
            />

            {/* Type Select */}
            <TextField
              select
              label="Type"
              variant="standard"
              className="search-bar"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              SelectProps={{
                native: true,
              }}
              style={{ flex: 2,  }}
            >
              <option value=""></option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="book">Book</option>
              <option value="other">Other</option>
            </TextField>

            {/* Vente Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 2, minWidth: "100px" ,marginTop:'13px'}}>
              <p style={{ fontSize: "14px", color: "gray", margin: 0 }}>En vente</p>
              <input
                type="checkbox"
                checked={onlyForSale}
                onChange={(e) => {
                  setOnlyForSale(e.target.checked);
                  setCurrentPage(1);
                }}
                style={{ transform: "scale(1.3)", cursor: "pointer" }}
              />
            </div>
          </div>

          <Button
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/upload")}
            className="upload-button-marketplace"
          >
            Upload IP
          </Button>
        </div>


        <hr style={{ marginBottom: "20px" }} />

        {/* Cards Layout */}
        <div className="ip-card-list-marketplace">
          {currentIps.map((ip) => (
            <div
              key={ip.id}
              className="ip-card"
              onClick={() => navigate(`/ip/${ip.id}`)}  //   On autorise toujours
              style={{ cursor: "pointer" }}             //   Toujours un curseur pointer
            >


              {/* File Preview */}
              <div className="ip-card-file-marketplace">
                {ip.type === "image" && <img src={ip.file_url} alt="IP" loading="lazy" className="file-preview-marketplace" />}
                {ip.type === "video" && (
                  <video className="file-preview-marketplace" controls muted>
                    <source src={ip.file_url} type="video/mp4" />
                  </video>
                )}
                {ip.type === "audio" && (
                  <audio className="file-audio" controls>
                    <source src={ip.file_url} type="audio/mp4" />
                  </audio>
                )}
                {ip.type === "book" && (
                  <div className="file-preview-marketplace pdf-preview-marketplace">
                    <FaFilePdf size={50} />
                  </div>
                )}

              </div>

              {/* IP Info */}
              <div className="ip-card-info-marketplace">
                <h3 className="ip-title-marketplace">
                  {ip.title}
                  {ip.is_for_sale && (
                    <span className="badge-for-sale">En Vente</span>
                  )}
                </h3>
              </div>


              {/* Action Buttons */}
              <div className="ip-card-actions-marketplace">
                <Button

                  variant="contained"
                  color="success"

                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 Pour ne pas déclencher le clic de la card
                    handleMintNFT(ip.file_url, ip.id);
                  }}
                  disabled={ip.nft_token_id !== "pending"} // 🔥 Désactiver seulement si déjà minté
                  className={ip.nft_token_id !== "pending" ? "button-disabled" : "mint-button"}
                >
                  Mint NFT
                </Button>

                {ip.is_for_sale ? (
  ip.owner_address !== connectedWalletAddress ? ( // 🔥 Si en vente ET pas toi
    <Button
      variant="contained"
      className="vente-button"
      onClick={(e) => {
        e.stopPropagation();
        handleBuyIP(ip.id);
      }}
    >
      Acheter
    </Button>
  ) : ( // 🔥 Si en vente ET c'est toi
    <Button
      variant="contained"
      color="secondary"
      className="vente-button"
      disabled
    >
      Déjà en vente
    </Button>
  )
) : ( // 🔥 Si PAS en vente
  <Button
    variant="contained"
    color="primary"
    className="vente-button"
    onClick={(e) => {
      e.stopPropagation();
      handlePutOnSale(ip.id);
    }}
  >
    Mettre en vente
  </Button>
)}


                <IconButton
                  color="warning"
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/update-metadata/${ip.id}`);
                  }}
                >
                  <Edit size={20} />
                </IconButton>

                <IconButton
                  color="error"
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIP(ip.id);
                  }}
                >
                  <Trash size={20} />
                </IconButton>
              </div>


            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
          <Button
            className="pagination-button"
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft size={20} /> {/* 👈 Left arrow icon */}
          </Button>

          <Button
            className="pagination-button"
            variant="outlined"
            disabled={currentPage * itemsPerPage >= filteredIps.length}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight size={20} /> {/* 👉 Right arrow icon */}
          </Button>
        </div>


        {alertMessage && (
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
