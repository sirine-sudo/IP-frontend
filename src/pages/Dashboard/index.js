import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { fetchUserProfile, logoutUser } from "../../api/userApi";
import CardContainer from "../../components/CardContainer";
import "./style.css";
import { FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";

const connectedWalletAddress = "0xCfa5C9015dd6949d1913AD58Df99e6a7A82BfFCF";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [ips, setIps] = useState([]);
    const navigate = useNavigate();
    const API_URL = "http://localhost:5000/api/ips";

    const handleBuyIP = (ipId) => {
        const confirmWallet = window.confirm("🔔 Connect your wallet to purchase this IP?");
        if (!confirmWallet) return;

        const confirmBuy = window.confirm(
            "✅ Confirm purchase of this digital IP?\n\n" +
            "By validating, you will officially become the owner of this asset.\n" +
            "Ownership transfer will be automatically processed to your connected wallet.\n\n"
        );
        if (!confirmBuy) return;

        toast.success("Purchase successful!");
        
        setIps((prevIps) =>
            prevIps.map((ip) =>
                ip.id === ipId
                    ? { ...ip, is_for_sale: false, owner_address: connectedWalletAddress }
                    : ip
            )
        );
    };

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
            setIps(Array.isArray(res.data) 
                ? res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
                : []);
        } catch (err) {
            console.error("Error loading IPs", err);
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
                        <h1 className="welcome-title fade-in-delay-1">Welcome, {user.name}</h1>
                        <div className="slogan fade-in-delay-2">
                            <div className="slogan-background"></div>
                            <h1 className="slogan-text">"Your creations are unique, their protection too."</h1>
                        </div>
                    </div>

                    <div className="latest-ips">
                        {ips.length === 0 ? (
                            <div className="no-ip">
                                <p>No IP found at the moment.</p>
                                <Link to="/upload" className="upload-button">
                                    Upload your first IP
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <h2>Discover the latest intellectual properties added to our marketplace</h2>
                                <div className="ip-grid">
                                    {ips.slice(0, 3).map((ip, index) => (
                                        <div key={index} className="ip-item">
                                            <div className="ip-image">
                                                {ip.type === "image" && <img src={ip.file_url} alt="IP" loading="lazy" className="ip-image" />}
                                                {ip.type === "video" && (
                                                    <video className="ip-image" controls muted>
                                                        <source src={ip.file_url} type="video/mp4" />
                                                    </video>
                                                )}
                                                {ip.type === "audio" && (
                                                    <audio className="file-audio" controls>
                                                        <source src={ip.file_url} type="audio/mp4" />
                                                    </audio>
                                                )}
                                                {ip.type === "book" && (
                                                    <div className="ip-image pdf-preview">
                                                        <FaFilePdf size={50} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ip-info">
                                                <h3>{ip.title || `IP ${index + 1}`}</h3>
                                                {ip.is_for_sale && (
                                                    <span className="badge-for-sale">For Sale</span>
                                                )}
                                            </div>
                                            <div className="ip-actions">
                                                <button
                                                    className="ip-button view-button-dash"
                                                    onClick={() => navigate(`/ip/${ip.id}`)}
                                                >
                                                    View IP
                                                </button>
                                                <button
                                                    className="ip-button buy-button"
                                                    onClick={() => handleBuyIP(ip.id)}
                                                >
                                                    Buy IP
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