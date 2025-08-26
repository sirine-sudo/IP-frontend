import React, { useState } from "react";
import { parseTTL, generateSmartContract } from "../../api/ttlApi";
import { Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import { FaFileAlt } from "react-icons/fa";
import Web3 from "web3";
import "../Marketplace/style.css";
import "./style.css";

const TTLUploader = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        toast.success("Wallet connected: " + accounts[0]);
      } catch (err) {
        toast.error("Connection failed: " + err.message);
      }
    } else {
      toast.error("Please install MetaMask");
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

  const handleGenerate = async () => {
    if (!account || !parsedData) {
      toast.warning("Connect wallet and parse TTL first");
      return;
    }

    try {
      const res = await generateSmartContract(parsedData, account); // envoie l’adresse
      toast.success(`Smart contract deployed at: ${res.contractAddress}`);
    } catch (err) {
      toast.error("Smart contract deployment failed: " + err.message);
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
          title="Upload a TTL contract"
          text="Turn your contracts into MPEG-21 smart contracts"
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

          {/* Action Buttons */}
          <div className="ttl-action-buttons">
            <Button
              variant="outlined"
              onClick={connectWallet}
              className="connect-wallet"
            >
              {account ? `Connected: ${account}` : "Connect to MetaMask"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleParse}
              disabled={!file}
              className="parse-button"
            >
              Parse Contract
            </Button>

            {parsedData && (
              <Button
                variant="contained"
                color="success"
                onClick={handleGenerate}
                className="generate-button"
              >
                Deploy Smart Contract
              </Button>
            )}
          </div>
        </div>

        {/* Parsed Data Preview */}
        {parsedData && (
          <div className="parsed-data-container">
            <Typography variant="h6" gutterBottom>
              Parsed Data:
            </Typography>
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
