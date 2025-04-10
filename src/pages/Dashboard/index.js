import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // 🔥 Ajoute axios
import { fetchUserProfile, logoutUser } from "../../api/userApi";

import CardContainer from "../../components/CardContainer";
import "./style.css";
import { FaFilePdf } from "react-icons/fa";
function Dashboard() {
    const [user, setUser] = useState(null);
    const [ips, setIps] = useState([]);
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000/api/ips";

    const handleLogout = useCallback(async () => {
        await logoutUser();
        navigate("/");
    }, [navigate]);

    const fetchUser = useCallback(async () => {
        const userData = await fetchUserProfile();
        if (!userData) {
            handleLogout();
            return;
        }
        setUser(userData);
    }, [handleLogout]);

    const fetchIPs = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}`);
            if (Array.isArray(res.data)) {
                const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setIps(sorted);
            } else {
                setIps([]);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des IPs", err);
        }
    }, []);

    useEffect(() => {
        fetchUser();
        fetchIPs();
    }, [fetchUser, fetchIPs]);

    return (
        <div className="dashboard-container">
            {user ? (
                <CardContainer className="dashboard-card fade-in">
                    <div className="welcome-section">
                    <h1 className="welcome-title fade-in-delay-1">Bienvenue, {user.name}</h1>
                    
                    <div className="slogan fade-in-delay-2">
                            <div className="slogan-background"></div>
                            <h1 className="slogan-text">" Vos créations sont uniques, leur protection aussi. "</h1>
                        </div>
                    </div>

                    <div className="latest-ips">
                        {ips.length === 0 ? (
                            <div className="no-ip">
                                <p>Aucune IP trouvée pour le moment.</p>
                                <Link to="/upload" className="upload-button">
                                    Uploader votre première IP
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <h2>Vos 3 derniers IPs :</h2>
                                <div className="ip-grid">
                                    {ips.slice(0, 3).map((ip, index) => (
                                        <div key={index} className="ip-item">

                                            {/* Image à gauche */}
                                         
              {/* File Preview */}
              <div className="ip-card-file">
                {ip.type === "image" && <img src={ip.file_url} alt="IP" loading="lazy" className="file-preview" />}
                {ip.type === "video" && (
                  <video className="file-preview" controls muted>
                    <source src={ip.file_url} type="video/mp4" />
                  </video>
                )}
                {ip.type === "audio" && (
                  <audio className="file-audio" controls>
                    <source src={ip.file_url} type="audio/mp4" />
                  </audio>
                )}
                {ip.type === "book" && (
                  <div className="file-preview pdf-preview">
                    <FaFilePdf size={50} />
                  </div>
                )}

              </div>
                                            {/* Titre au centre */}
                                            <div className="ip-info">
                                                <h3>{ip.title || `IP ${index + 1}`}</h3>
                                                {ip.is_for_sale && (
                    <span className="badge-for-sale">En Vente</span>
                  )}
                                            </div>

                                            {/* Boutons à droite */}
                                            <div className="ip-actions">
                                                <button
                                                    className="ip-button view-button-dash"
                                                    onClick={() => navigate(`/ip/${ip.id}`)} // 🔥 Voir détails IP
                                                >
                                                    Voir IP
                                                </button>

                                                <button
                                                    className="ip-button buy-button"
                                                    onClick={() => alert("Acheter IP en construction...")} // 🔥 Fonction d'achat à faire
                                                >
                                                    Acheter IP
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>



                        )}
                    </div>
                </CardContainer>
            ) : (
                <CardContainer className="dashboard-card fade-in"></CardContainer>
            )}
        </div>
    );
}

export default Dashboard;
