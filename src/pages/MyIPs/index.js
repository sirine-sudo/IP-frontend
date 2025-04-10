import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MintNFT from "../../components/MintNFT";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import { FaFilePdf } from "react-icons/fa";
import { Edit, Trash } from "lucide-react";
import "../Marketplace/style.css"; // 🔥 Garde ton style marketplace

const connectedWalletAddress = "0xCfa5C9015dd6949d1913AD58Df99e6a7A82BfFCF"; // Adresse simulée
const API_URL = "http://localhost:5000/api/ips";

function MyIPs() {
  const [myIps, setMyIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleMintNFT = async (fileUrl, ipId) => {
    await MintNFT(fileUrl, ipId);
  };

  const handlePutOnSale = async (ipId) => {
    const price = prompt("Prix de vente en ETH :");
    if (!price) return;
    try {
      await axios.put(`${API_URL}/${ipId}/sale`, { is_for_sale: true, price });
      alert("IP mise en vente !");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise en vente.");
    }
  };

  const handleDeleteIP = async (id) => {
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cet IP ?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMyIps((prev) => prev.filter((ip) => ip.id !== id));
      alert("IP supprimée avec succès !");
    } catch (error) {
      console.error(error);
      alert("Échec de la suppression.");
    }
  };

  useEffect(() => {
    const fetchMyIPs = async () => {
      try {
        const res = await axios.get(API_URL);
        if (Array.isArray(res.data)) {
          const ownedIps = res.data.filter(
            (ip) => ip.owner_address?.toLowerCase() === connectedWalletAddress.toLowerCase()
          );
          setMyIps(ownedIps);
        } else {
          setMyIps([]);
        }
      } catch (err) {
        setError("Impossible de charger vos IPs.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyIPs();
  }, []);

  if (loading) return <CardContainer></CardContainer>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <CardContainer>
      <div>
        <TitleSection
          title="Mes Propriétés Intellectuelles"
          text="Voici toutes les IPs que vous possédez."
        />

        <hr style={{ marginBottom: "20px" }} />

        <div className="ip-card-list-marketplace">
          {myIps.length === 0 ? (
            <Alert severity="info">Vous ne possédez aucune IP pour le moment.</Alert>
          ) : (
            myIps.map((ip) => (
                <div
                key={ip.id}
                className="ip-card"
                onClick={() => navigate(`/ip/${ip.id}`)}  //   On autorise toujours
                style={{ cursor: "pointer" }}             //   Toujours un curseur pointer
              >
                {/* Fichier preview */}
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

                {/* Info */}
                <div className="ip-card-info-marketplace">
                  <h3 className="ip-title-marketplace">
                    {ip.title}
                    {ip.is_for_sale && (
                      <span className="badge-for-sale">En Vente</span>
                    )}
                  </h3>
                </div>

                {/* Actions */}
                <div className="ip-card-actions-marketplace">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMintNFT(ip.file_url, ip.id);
                    }}
                    disabled={ip.nft_token_id !== "pending"}
                    className={ip.nft_token_id !== "pending" ? "button-disabled" : "mint-button"}
                  >
                    Mint NFT
                  </Button>

                  {ip.is_for_sale ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      className="vente-button"
                      disabled
                    >
                      Déjà en vente
                    </Button>
                  ) : (
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
            ))
          )}
        </div>
      </div>
    </CardContainer>
  );
}

export default MyIPs;
