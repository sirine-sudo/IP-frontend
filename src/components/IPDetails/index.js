import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";

import CardContainer from "../../components/CardContainer";
import './style.css'
 import { ChevronLeft } from "lucide-react";
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
    <CardContainer >
      <div className="ip-details-container">
        <div className="details-container">


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
            {
              ip.type === "book" && (
                <iframe
                  src={`https://ipfs.io/ipfs/${ip.file_url.split("ipfs/")[1]}`}
                  title="PDF Viewer"
                  className="file-preview"
                  style={{
                    width: '100%',
                    height: '80vh',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 8px rgba(0,0,0,0.1)',
                  }}
                />
              )
            }


            <p style={{ fontSize: '15px', textAlign: 'center', marginLeft: '-20px' }}>
              <strong>Type :</strong> {ip.type}
            </p>

          </div>

          {/* Bloc Infos */}
          <div className="ip-details-info">
            <h3 style={{ marginBottom: '10px' }} >{ip.title}</h3>
            <p><strong>ID Créateur :</strong> {ip.creator_id} | <strong>Créateur préféré :</strong> {ip.preferred_creator_name || "Non défini"}</p>

            <p><strong>Description :</strong> {ip.description}</p>

            <p><strong>Adresse du propriétaire :</strong> {ip.owner_address === "unknown" ? (
              <span style={{ color: "gray" }}>Indisponible — NFT pas encore minté.</span>
            ) : ip.owner_address}
            </p>

            <p><strong>Smart Contract :</strong> {!ip.smart_contract_address ? (
              <span style={{ color: "gray" }}>Non défini</span>
            ) : ip.smart_contract_address}
            </p>

            <p><strong>Token ID :</strong> {ip.nft_token_id === "pending" ? (
              <span style={{ color: "gray" }}>Pending (NFT pas encore créé)</span>
            ) : ip.nft_token_id}
            </p>

            <p><strong>Royalties :</strong> {ip.royalty_percentage} %</p>

            <p><strong>Statut de vente :</strong> {ip.is_for_sale ? "En vente" : "Non en vente"} |     {ip.price && (
              <><strong>Prix :</strong> {ip.price} ETH</>
            )}</p>



            <p><strong>File Hash :</strong> {ip.file_hash}</p>

            <p><strong>IPFS CID :</strong> {ip.ipfs_cid}</p>

            <p><strong>Fichier IPFS :</strong> <a href={ip.file_url} target="_blank" rel="noreferrer">Voir sur IPFS</a></p>

            <p><strong>Date de création :</strong> {new Date(ip.createdAt).toLocaleString()} | <strong>Dernière mise à jour :</strong> {new Date(ip.updatedAt).toLocaleString()}</p>

            {/* Bouton retour */}
            <div
              className="back-button-div"

            >  <Button
              className="back-button"
              variant="outlined"
              onClick={() => window.history.back()}
            > Retour
                <ChevronLeft size={20} /> {/* 👈 Left arrow icon */}
              </Button></div>


          </div>


        </div>
      </div>
    </CardContainer>

  );
};

export default IPDetails;
