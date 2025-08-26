import React, { useState } from "react";
import { parseTTL, deploySpec } from "../../api/ttlApi";
import { Button, Typography } from "@mui/material";
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
  const [account, setAccount] = useState(null);

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

  const handleParse = async () => {
    if (!file) {
      toast.warning("Please select a TTL file");
      return;
    }
    try {
      const data = await parseTTL(file);
      console.log("✅ TTL Parsed Result:", data);
      setParsedData(data);
      toast.success("TTL file parsed successfully!");
    } catch (err) {
      toast.error("Parsing error: " + err.message);
    }
  };
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!account || !parsedData || loading) return;
    setLoading(true);
    try {
      const spec = parsedData.contracts?.[0] || parsedData;
      const out = await deploySpec(spec, account);
  
      // --- Console log complet ---
      console.log("🚀 Deployment Result:", out);
  
      // --- Toast avec lien Etherscan ---
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
        { autoClose: false } // ne se ferme pas trop vite
      );
    } catch (e) {
      toast.error("Smart contract deployment failed: " + e.message);
    } finally {
      setLoading(false);
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
        <TitleSection title="Upload a TTL contract" text="Turn your contracts into MPEG-21 smart contracts" />
      </div>

      <hr style={{ marginBottom: "20px" }} />

      <div className="ip-card-list-marketplace">
        <div className="ttl-upload-container">
          {/* File Upload */}
          <div className="file-upload-box">
            <label htmlFor="ttl-upload" className="file-upload-label">
              <FaFileAlt size={40} className="file-icon" />
              <Typography variant="body1" className="file-upload-text">
                {fileName || "Select a .ttl file"}
              </Typography>
              <input id="ttl-upload" type="file" accept=".ttl" onChange={handleFileChange} hidden />
            </label>
          </div>

          {/* Actions */}
          <div className="ttl-action-buttons">
            <Button variant="outlined" onClick={connectWallet} className="connect-wallet">
              {account ? `Connected: ${account}` : "Connect to MetaMask"}
            </Button>

            <Button variant="contained" color="primary" onClick={handleParse} disabled={!file} className="parse-button">
              Parse Contract
            </Button>

            {parsedData && (
              <Button disabled={loading}  variant="contained" color="success" onClick={handleGenerate} className="generate-button">
                Deploy Smart Contract
              </Button>
            )}
          </div>
        </div>

        {/* Parsed Data Preview */}
        {parsedData && (
          <div className="parsed-data-container">
            <Typography variant="h6" gutterBottom>Parsed Data:</Typography>
            <pre className="parsed-data-preview">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </CardContainer>
  );
};

export default TTLUploader;
