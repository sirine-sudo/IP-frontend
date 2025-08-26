import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// ✅ Parser fichier TTL (.ttl)
export const parseTTL = async (ttlFile) => {
  const formData = new FormData();
  formData.append("ttl", ttlFile); // doit correspondre à .single("ttl")

  const res = await axios.post(`${API_BASE}/parse`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // ← { contracts: [...] }
};

// ✅ Envoyer le contrat parsé au backend pour déploiement
export const generateSmartContract = async (parsedData, account) => {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contracts: [parsedData.contracts?.[0] || parsedData], // toujours array
      account
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Smart contract generation failed");
  }

  return await res.json();
};
