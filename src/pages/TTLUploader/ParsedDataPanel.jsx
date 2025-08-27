import React from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { deploySpec } from "../../api/ttlApi";

const ParsedDataPanel = ({ mode, parsing, parsedData, account }) => {
  const handleDeploy = async () => {
    if (!account) return toast.warning("Connect wallet first");
    if (!parsedData) return toast.warning("Parse a TTL first");

    try {
      const spec = parsedData.contracts?.[0] || parsedData;
      const out = await deploySpec(spec, account);
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
      const msg = e?.response?.data || e?.message || "Deploy failed";
      toast.error("Smart contract deployment failed: " + msg);
    }
  };

  return (
    <div className="parsed-data-wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" gutterBottom>Parsed Data</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleDeploy}
          disabled={!parsedData || !account || parsing}
        >
          Deploy Smart Contract
        </Button>
      </div>

      {mode === "upload" && !parsedData && !parsing && (
        <div className="parsed-hint">Sélectionnez un fichier .ttl pour lancer l’analyse automatiquement.</div>
      )}

      {parsing && (
        <div className="parsed-loading">
          <CircularProgress size={22} />
          <span style={{ marginLeft: 8 }}>Parsing in progress…</span>
        </div>
      )}

      {parsedData && !parsing && (
        <pre className="parsed-pre">{JSON.stringify(parsedData, null, 2)}</pre>
      )}
    </div>
  );
};

export default ParsedDataPanel;
