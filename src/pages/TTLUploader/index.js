import React, { useState } from "react";
import { parseTTL, generateSmartContract } from "../../api/ttlApi";
import { Button,   Typography } from "@mui/material";
import { toast } from "react-toastify";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import { FaFileAlt } from "react-icons/fa";
import "../Marketplace/style.css";
import "./style.css";

const TTLUploader = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleParse = async () => {
    if (!file) {
      toast.warning("Veuillez sélectionner un fichier TTL");
      return;
    }
    try {
      const data = await parseTTL(file);
      setParsedData(data);
      toast.success("Fichier TTL parsé avec succès !");
    } catch (err) {
      toast.error("Erreur lors du parsing : " + err.message);
    }
  };

  const handleGenerate = async () => {
    try {
      const res = await generateSmartContract(parsedData);
      toast.success(`Smart contract déployé à l'adresse: ${res.contractAddress}`);
    } catch (err) {
      toast.error("Erreur génération smart contract : " + err.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <CardContainer>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TitleSection
          title="Uploader un contrat TTL"
          text="Transformez vos contrats en smart contracts MPEG-21"
        />
      </div>

      <hr style={{ marginBottom: "20px" }} />

      <div className="ip-card-list-marketplace">
        <div className="ttl-upload-container">
          {/* File Upload Section */}
          <div className="file-upload-box">
            <label htmlFor="ttl-upload" className="file-upload-label">
              <FaFileAlt size={40} className="file-icon" />
              <Typography variant="body1" className="file-upload-text">
                {fileName || "Sélectionnez un fichier .ttl"}
              </Typography>
              <input
                id="ttl-upload"
                type="file"
                accept=".ttl"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="ttl-action-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleParse}
              disabled={!file}
              className="parse-button"
            >
              Parser le Contrat
            </Button>

            {parsedData && (
              <Button
                variant="contained"
                color="success"
                onClick={handleGenerate}
                className="generate-button"
              >
                Déployer le Smart Contract
              </Button>
            )}
          </div>

          {/* Parsed Data Preview */}
          {parsedData && (
            <div className="parsed-data-container">
              <Typography variant="h6" gutterBottom>
                Données Parsées:
              </Typography>
              <pre className="parsed-data-preview">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </CardContainer>
  );
};

export default TTLUploader;