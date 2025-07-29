import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const parseTTL = async (ttlFile) => {
  const formData = new FormData();
  formData.append("ttl", ttlFile);

  const res = await axios.post(`${API_BASE}/parse`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // Media Contractual Objects
};

export const generateSmartContract = async (mediaObjects) => {
  const res = await axios.post(`${API_BASE}/generate`, mediaObjects);
  return res.data; // adresse du contrat ou détails
};
