import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/users/admin/users"; // ✅ Ajuste si besoin

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token"); // 🔥 Récupérer le token

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/users/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 Envoyer le token ici
        },
      });

      setUsers(res.data); // ✅ Stocker les users
    } catch (error) {
      console.error("Erreur de chargement des utilisateurs :", error);
    }
  };
  const handlePromote = async (userId) => {
    const token = localStorage.getItem("token"); // 🔥 récupérer le token
  
    if (!token) {
      console.error("No token found.");
      return;
    }
  
    try {
      await axios.put(
        `http://localhost:5000/api/users/admin/users/${userId}/promote`,
        {}, // 🔥 body vide
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 headers ici
          },
        }
      );
      alert("✅ Utilisateur promu avec succès !");
    } catch (error) {
      console.error("Erreur promotion :", error);
      alert("❌ Erreur lors de la promotion !");
    }
  };
  


  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
  
    try {
      await axios.delete(`${API_URL}/${userId}`, {   
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Utilisateur supprimé !");
      fetchUsers(); // 🔥 Recharge la liste après suppression
    } catch (error) {
      console.error(error);
      alert("❌ Erreur de suppression.");
    }
  };
  
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>Liste des Utilisateurs</Typography>

      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        users.map((user) => (
          <Card key={user.id} style={{ marginBottom: "15px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography>Email : {user.email}</Typography>
              <Typography>Rôle : {user.role}</Typography>
              <Typography>Adresse Ethereum : {user.ethereum_address || "Non connectée"}</Typography>

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {user.role === "simple-user" && (
                  <Button variant="contained" color="success" onClick={() => handlePromote(user.id)}>
                    Promouvoir en IP Owner
                  </Button>
                )}
                <Button variant="contained" color="error" onClick={() => handleDelete(user.id)}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default UsersList;
