import axios from "axios";
const API_BASE = "http://localhost:5000/api";

export const parseTTL = async (ttlFile) => {
  const fd = new FormData();
  fd.append("ttl", ttlFile);
  const { data } = await axios.post(`${API_BASE}/parse`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deploySpec = async (spec, account) => {
  const res = await fetch(`${API_BASE}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spec, account }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // -> { network, chainId, deployer, nfToken, contract }
};
