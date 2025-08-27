import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import TitleSection from "../../components/TitleSection";
import CardContainer from "../../components/CardContainer";
import { toast } from "react-toastify";

import UploadTab from "./UploadTab";
import CreateTab from "./CreateTab";
import ParsedDataPanel from "./ParsedDataPanel";

import "./style.css";

const TTLUploader = () => {
  const [mode, setMode] = useState("create");
  const [parsedData, setParsedData] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error("Please install MetaMask");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      toast.success("Wallet connected: " + accounts[0]);
    } catch (e) {
      toast.error(e.message || "Wallet connection failed");
    }
  };

  return (
    <CardContainer>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TitleSection title="Create or Upload a TTL contract" text="Valid for the official ISO parser" />
      </div>

      <hr style={{ marginBottom: "12px" }} />

      <div className="ttl-mode-switch">
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          aria-label="choose-mode"
        >
          <ToggleButton value="create">Créer un TTL</ToggleButton>
          <ToggleButton value="upload">Uploader un TTL</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="ttl-top">
        {mode === "create" ? (
          <CreateTab setParsedData={setParsedData} setParsing={setParsing} />
        ) : (
          <UploadTab setParsedData={setParsedData} setParsing={setParsing} />
        )}
      </div>

      <ParsedDataPanel
        mode={mode}
        parsing={parsing}
        parsedData={parsedData}
        account={account}
        connectWallet={connectWallet} // <-- pass it here
      />
    </CardContainer>
  );
};

export default TTLUploader;
