import React, { useEffect, useMemo, useState } from "react";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { parseTTL } from "../../api/ttlApi";
import buildTTL from "./helpers/buildTTL";

const CreateTab = ({ setParsedData, setParsing }) => {
  const [form, setForm] = useState({
    identifier: "urn:mpeg:mpeg21:mco:contract:001",
    label: "Digital Sale Contract",
    tokenName: "MCO-NFT-test",
    tokenSymbol: "MCO",
    parties: "0x0000000000000000000000000000000000000001, 0x0000000000000000000000000000000000000002",
    contentUri: "ipfs://bafy.../contract.json",
    contentHash: "0x",
  });

  const [ttlText, setTtlText] = useState("");

  const updateField = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  // TTL généré automatiquement
  const generatedTTL = useMemo(() => buildTTL(form), [form]);

  useEffect(() => {
    setTtlText(generatedTTL);
  }, [generatedTTL]);

  const downloadTTL = () => {
    if (!(ttlText || "").trim()) {
      toast.warning("Rien à télécharger.");
      return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ttlText], { type: "text/turtle" }));
    a.download = "contract.ttl";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const parseFromText = async () => {
    try {
      if (!(ttlText || "").trim()) {
        toast.warning("Aucun contenu TTL.");
        return;
      }
      setParsedData(null);
      setParsing(true);

      const blob = new Blob([ttlText], { type: "text/turtle" });
      const file = new File([blob], "generated.ttl", { type: "text/turtle" });
      const data = await parseTTL(file); // envoie au backend /api/parse
      console.log("✅ TTL Parsed (official):", data);
      setParsedData(data);
      toast.success("TTL parsed successfully (official parser).");
    } catch (e) {
      const msg = e?.response?.data || e?.message || "Parsing failed";
      console.error(e);
      toast.error(`Parsing error: ${msg}`);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="ttl-create">
      <Typography variant="subtitle1" gutterBottom>Créer un TTL (ISO compatible)</Typography>

      <div className="ttl-grid">
        <TextField label="Identifier (URN/URL)" value={form.identifier} onChange={updateField("identifier")} size="small" fullWidth />
        <TextField label="Label (rdfs:label)" value={form.label} onChange={updateField("label")} size="small" fullWidth />
        <TextField label="Token name" value={form.tokenName} onChange={updateField("tokenName")} size="small" fullWidth />
        <TextField label="Token symbol" value={form.tokenSymbol} onChange={updateField("tokenSymbol")} size="small" fullWidth />
        <TextField label="Parties (0x..., séparées par des virgules)" value={form.parties} onChange={updateField("parties")} size="small" fullWidth />
        <TextField label="Content URI" value={form.contentUri} onChange={updateField("contentUri")} size="small" fullWidth />
        <TextField label="Content hash (0x...)" value={form.contentHash} onChange={updateField("contentHash")} size="small" fullWidth />
      </div>

      <div className="ttl-create-actions">
        <Button variant="outlined" onClick={downloadTTL}>Télécharger .ttl</Button>
        <Button variant="contained" onClick={parseFromText}>Valider & Parser</Button>
      </div>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" gutterBottom>TTL (éditable)</Typography>
      <textarea
        className="ttl-textarea"
        value={ttlText}
        onChange={(e) => setTtlText(e.target.value)}
        placeholder="TTL généré (vous pouvez éditer librement avant de parser)"
      />
    </div>
  );
};

export default CreateTab;
