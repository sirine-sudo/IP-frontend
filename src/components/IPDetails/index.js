import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, CircularProgress } from "@mui/material";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import './style.css'
const IPDetails = () => {
  const { id } = useParams();
  const [ip, setIP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/ips/${id}`);
        setIP(res.data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIP();
  }, [id]);

  if (loading) return <CircularProgress sx={{ margin: "30px auto", display: "block" }} />;
  if (!ip) return <p style={{ color: "red" }}>Propriété introuvable.</p>;

  return (
    <CardContainer width="98%" height="auto" margin="10px">
      <div className="ip-details-container">

<div className="details-container">


          <div className="ip-details-image">
          <img src={ip.file_url} alt={ip.title} />
        </div>

        <div className="ip-details-info">
          <h3>{ip.title}</h3>
          <p><strong>Description :</strong> {ip.description}</p>
          <p><strong>Type :</strong> {ip.type}</p>
          <p><strong>Adresse du propriétaire :</strong> {ip.owner_address}</p>
          <p><strong>Smart Contract :</strong> {ip.smart_contract_address || "Non défini"}</p>
          <p><strong>Token ID :</strong> {ip.nft_token_id}</p>
          <p><strong>Royalties :</strong> {ip.royalty_percentage} %</p>
          <p><strong>Fichier IPFS :</strong> <a href={ip.file_url} target="_blank" rel="noreferrer">Voir sur IPFS</a></p>
        </div>

</div>

      </div>
    </CardContainer>
  );
};

export default IPDetails;
