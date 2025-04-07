import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardContainer from "../../components/CardContainer";
import TitleSection from "../../components/TitleSection";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // ➡️ Nouvelle variable pour la page
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api/users/admin/users";

  const usersPerPage = 3; // ➡️ 3 users par page

  useEffect(() => {
    fetchUsersWithWhitelist();
  }, []);

  const fetchUsersWithWhitelist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersWithWhitelistStatus = await Promise.all(
        res.data.map(async (user) => {
          if (user.ethereum_address) {
            const isWhitelisted = await checkWhitelist(user.ethereum_address);
            return { ...user, isWhitelisted };
          }
          return { ...user, isWhitelisted: false };
        })
      );

      setUsers(usersWithWhitelistStatus);
    } catch (error) {
      console.error("Erreur de chargement des utilisateurs :", error);
    }
  };

  const checkWhitelist = async (address) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const res = await axios.get(`http://localhost:5000/api/whitelist/check?userAddress=${address}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.isWhitelisted;
    } catch (error) {
      console.error("Erreur lors de la vérification de la whitelist :", error);
      return false;
    }
  };

  const handleWhitelist = async (userAddress, userId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/whitelist/add",
        { userAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isWhitelisted: true } : user
        )
      );

      toast.success("✅ Utilisateur ajouté à la whitelist !");
    } catch (error) {
      console.error(error);
      toast.error("❌ Erreur lors de l'ajout à la whitelist.");
    }
  };

  const handlePromote = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(`${API_URL}/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Utilisateur promu avec succès !");
      fetchUsersWithWhitelist();
    } catch (error) {
      console.error("Erreur promotion :", error);
      toast.error("❌ Erreur lors de la promotion !");
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
      toast.success("✅ Utilisateur supprimé !");
      fetchUsersWithWhitelist();
    } catch (error) {
      console.error(error);
      toast.error("❌ Erreur de suppression.");
    }
  };

  // 🔥 Search + Pagination
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <CardContainer width="98%" height="84vh">
      <div>

        {/* Header Title + Search Bar */}
        <div className="title-search-container">
          <div className="title-search-header">
            <TitleSection
              title="Liste des Utilisateurs"
              text="Gérez les utilisateurs, leur promotion et leur whitelistage."
            />
          </div>

          <div className="title-search-bar">
            <TextField
              label="Rechercher par nom ou email"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page à 1
              }}
            />
          </div>
        </div>

        <hr style={{ marginBottom: "20px" }} />

        {/* User List */}
        <div className="ip-card-list">
          {currentUsers.length === 0 ? (
            <p>Aucun utilisateur trouvé.</p>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user.id}
                className="ip-card"
                style={{ cursor: "default" }}
              >
                <div className="ip-card-info">
                  <h3 className="ip-title">{user.name}</h3>
                  <p className="ip-description">
                    <strong>Email :</strong> {user.email}  |   <strong>Rôle :</strong> {user.role}
                  </p>
                  <p className="ip-description">
                    <strong>Adresse Ethereum :</strong>{" "}
                    {user.ethereum_address || (
                      <span style={{ color: "gray" }}>
                        Wallet non connecté (connecter un portefeuille pour apparaître dans la whitelist)
                      </span>
                    )}
                  </p>
                  <p className="ip-description">
                    <strong>Whitelisté :</strong>{" "}
                    {!user.ethereum_address ? (
                      <span style={{ color: "gray" }}>
                        Impossible de whitelist sans portefeuille connecté
                      </span>
                    ) : user.isWhitelisted ? (
                      <span style={{ color: "green" }}>✅ Oui</span>
                    ) : (
                      <span style={{ color: "red" }}>❌ Non</span>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="ip-card-actions">
                  {user.role === "simple-user" && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handlePromote(user.id)}
                    >
                      Promouvoir en IP Owner
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleDelete(user.id)}
                  >
                    Supprimer
                  </Button>

                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    style={{ marginTop: "10px" }}
                    disabled={!user.ethereum_address || user.isWhitelisted}
                    onClick={() => handleWhitelist(user.ethereum_address, user.id)}
                  >
                    Ajouter à la Whitelist
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Précédent
          </Button>

          <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Suivant
          </Button>
        </div>

      </div>
    </CardContainer>
  );
};

export default UsersList;
