import React, { useState } from "react";

const AudioLyricsEditor = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [lyricsFile, setLyricsFile] = useState(null);
  const [modifiedFileUrl, setModifiedFileUrl] = useState(null);

  const handleAudioUpload = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleLyricsUpload = (e) => {
    setLyricsFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("lyrics", lyricsFile);

    const res = await fetch("http://localhost:5000/api/editor/process", {
      method: "POST",
      body: formData,
    });
    

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    setModifiedFileUrl(downloadUrl);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🎧 Éditeur Audio / Lyrics</h2>

      <div>
        <label>📥 Audio (.mp3 / .mp4) :</label><br />
        <input type="file" accept="audio/*,video/mp4" onChange={handleAudioUpload} />
      </div>

      <div>
        <label>📝 Paroles (.txt) :</label><br />
        <input type="file" accept=".txt" onChange={handleLyricsUpload} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSubmit}>Ajouter piste / Générer</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {modifiedFileUrl && (
          <a href={modifiedFileUrl} download="modified-output.mp4">
            ⬇️ Télécharger le fichier modifié
          </a>
        )}
      </div>
    </div>
  );
};

export default AudioLyricsEditor;
