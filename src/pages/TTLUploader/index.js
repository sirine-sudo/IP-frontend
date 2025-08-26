import React, { useState } from "react";
import { parseTTL, deploySpec } from "../../api/ttlApi";
import { Button, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import { FaFileAlt } from "react-icons/fa";
import "../Marketplace/style.css";
import "./style.css";

const TTLUploader = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [account, setAccount] = useState(null);

  const [parsedData, setParsedData] = useState(null);
  const [parsing, setParsing] = useState(false);

  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      toast.success("Wallet connected: " + accounts[0]);
    } catch (err) {
      toast.error("Connection failed: " + err.message);
    }
  };

  // 👉 Parse AUTO dès qu’un fichier est choisi
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setParsedData(null);
    setParsing(true);

    try {
      const data = await parseTTL(selectedFile);
      console.log("✅ TTL Parsed Result:", data);
      setParsedData(data);
      toast.success("TTL file parsed successfully!");
    } catch (err) {
      console.error(err);
      setParsedData(null);
      toast.error("Parsing error: " + err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleGenerate = async () => {
    if (!account) {
      toast.warning("Connect wallet first");
      return;
    }
    if (!parsedData) {
      toast.warning("Please upload a TTL file (auto-parse will run)");
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const spec = parsedData.contracts?.[0] || parsedData;
      const out = await deploySpec(spec, account);

      // Console log détaillé
      console.log("🚀 Deployment Result:", out);

      // Lien Etherscan Sepolia
      const explorer = "https://sepolia.etherscan.io/address";
      toast.success(
        <div>
          <div>✅ <b>Deployed!</b></div>
          <div>
            Contract:{" "}
            <a href={`${explorer}/${out.contract}`} target="_blank" rel="noreferrer">
              {out.contract}
            </a>
          </div>
          <div>
            NFToken:{" "}
            <a href={`${explorer}/${out.nfToken}`} target="_blank" rel="noreferrer">
              {out.nfToken}
            </a>
          </div>
        </div>,
        { autoClose: false }
      );
    } catch (e) {
      toast.error("Smart contract deployment failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContainer>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TitleSection
          title="Upload a TTL contract"
          text="Turn your contracts into MPEG-21 smart contracts"
        />
      </div>

      <hr style={{ marginBottom: "20px" }} />

      <div className="ttl-top">
        {/* Upload box */}
        <div className="file-upload-box full">
          <label htmlFor="ttl-upload" className="file-upload-label">
            <FaFileAlt size={40} className="file-icon" />
            <Typography variant="body1" className="file-upload-text">
              {fileName || "Select a .ttl file"}
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

        {/* Actions */}
        <div className="ttl-actions">
          <Button variant="outlined" onClick={connectWallet} className="connect-wallet">
            {account ? `Connected: ${account}` : "Connect to MetaMask"}
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleGenerate}
            disabled={!parsedData || !account || loading || parsing}
            className="generate-button"
          >
            {loading ? "Deploying..." : "Deploy Smart Contract"}
          </Button>
        </div>
      </div>

      {/* Parsed Data pleine largeur en dessous */}
      <div className="parsed-data-wide">
        <Typography variant="h6" gutterBottom>Parsed Data</Typography>

        {!file && (
          <div className="parsed-hint">
            Sélectionnez un fichier .ttl pour lancer l’analyse automatiquement.
          </div>
        )}

        {parsing && (
          <div className="parsed-loading">
            <CircularProgress size={22} />
            <span style={{ marginLeft: 8 }}>Parsing in progress…</span>
          </div>
        )}

        {parsedData && !parsing && (
          <pre className="parsed-pre">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        )}
      </div>
    </CardContainer>
  );
};

export default TTLUploader;
