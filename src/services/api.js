 
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
  
    try {
      const response = await fetch("http://localhost:5000/api/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) throw new Error("Échec du rafraîchissement du token");
  
      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("Erreur lors du refresh token :", error);
      return null;
    }
  };
  
  export const uploadIP = async (formData) => {
    let token = localStorage.getItem("token");
    if (!token) token = await refreshAccessToken();
    if (!token) throw new Error("Impossible d'obtenir un token");
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("file", formData.file);
    data.append("royalty_percentage", formData.royalty_percentage || 0);
  
    const response = await fetch("http://localhost:5000/api/ips", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: data,
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  
    return await response.json();
  };
  