import React, { useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { deploySpec } from "../../api/ttlApi";

const ParsedDataPanel = ({ mode, parsing, parsedData, account, connectWallet }) => {
  const [deploying, setDeploying] = useState(false); // NEW state

  const handleDeploy = async () => {
    if (!account) return toast.warning("Connect wallet first");
    if (!parsedData) return toast.warning("Parse a TTL first");
    if (deploying) return; // prevent re-click

    setDeploying(true);
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
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="parsed-data-wide">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
          Parsed Data
        </Typography>

        {/* RIGHT ACTIONS ROW: Connect + Deploy */}
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Button variant="outlined" onClick={connectWallet} disabled={deploying}>
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect to MetaMask"}
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleDeploy}
            disabled={!parsedData || !account || parsing || deploying}
            startIcon={deploying && <CircularProgress size={18} color="inherit" />}
          >
            {deploying ? "Deploying..." : "Deploy Smart Contract"}
          </Button>
        </Stack>
      </Box>

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
