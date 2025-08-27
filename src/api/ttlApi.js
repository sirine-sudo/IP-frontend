import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// POST /api/parse avec multipart form-data "ttl"
export const parseTTL = async (ttlFile) => {
  const formData = new FormData();
  formData.append("ttl", ttlFile);
  const res = await axios.post(`${API_BASE}/parse`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// POST /api/deploy (si ton backend expose bien cette route)
export const deploySpec = async (spec, account) => {
  const res = await axios.post(`${API_BASE}/deploy`, { spec, account });
  return res.data;
};
