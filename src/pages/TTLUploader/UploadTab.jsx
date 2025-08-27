import React, { useState } from "react";
import { Typography } from "@mui/material";
import { FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { parseTTL } from "../../api/ttlApi";

const UploadTab = ({ setParsedData, setParsing }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setParsedData(null);
    setParsing(true);
    setFileName(selectedFile.name);

    try {
      const data = await parseTTL(selectedFile);
      console.log("✅ TTL Parsed Result (upload):", data);
      setParsedData(data);
      toast.success("TTL parsed successfully (official parser).");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data || err?.message || "Parsing failed";
      toast.error("Parsing error: " + msg);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="file-upload-box full">
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
  );
};

export default UploadTab;
