import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [ipList, setIpList] = useState([]);
const [adminList, setAdminList] = useState([]);

    const navigate = useNavigate();
    const fetchIPs = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/users/ips", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setIpList(res.data); // Stocke la liste des IPs
        } catch (error) {
            console.error("Erreur lors de la récupération des IPs :", error);
        }
    };
    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/users/admins", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setAdminList(res.data); // Stocke la liste des admins
        } catch (error) {
            console.error("Erreur lors de la récupération des admins :", error);
        }
    };
    
    // 🔹 Wrap `handleLogout` in `useCallback`
    const handleLogout = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                await axios.post("http://localhost:5000/api/users/logout", { token: refreshToken });
            }

            // Clear tokens from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            navigate("/"); // Redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [navigate]); // Now `handleLogout` only depends on `navigate`

    // 🔹 Refresh Access Token Function
    const refreshAccessToken = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.error("No refresh token available.");
                throw new Error("No refresh token available");
            }

            const res = await axios.post("http://localhost:5000/api/users/refresh-token", { token: refreshToken });

            if (res.data && res.data.accessToken) {
                console.log("New Access Token Received:", res.data.accessToken);
                localStorage.setItem("token", res.data.accessToken);
                return res.data.accessToken;
            } else {
                throw new Error("Invalid refresh token response");
            }
        } catch (error) {
            console.error("Session expired, please log in again.");
            handleLogout(); // Now `handleLogout` is stable
            return null;
        }
    }, [handleLogout]); // `handleLogout` is now stable

    // 🔹 Connect MetaMask
    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const accounts = await web3.eth.getAccounts();
                console.log("Connected MetaMask Address:", accounts[0]);
    
                // Send wallet address to backend
                const token = localStorage.getItem("token");
                await axios.post(
                    "http://localhost:5000/api/users/connect-wallet",
                    { ethereum_address: accounts[0] },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                alert("Wallet Connected Successfully!");
    
                // 🔹 Fetch updated user data to reflect wallet address
                fetchUser(); 
    
            } catch (error) {
                console.error("MetaMask connection error:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to proceed.");
        }
    };
    

    // 🔹 Fetch User Data
const fetchUser = useCallback(async () => {
    let token = localStorage.getItem("token");

    try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User Data Fetched:", res.data); // 🔹 Log user data
        setUser(res.data);
        if (res.data.role === "ip-owner") {
            fetchIPs();
        } else if (res.data.role === "admin") {
            fetchAdmins();
        }
        
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("Access token expired. Refreshing...");
            token = await refreshAccessToken();
            if (token) {
                const res = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("User Data Fetched After Refresh:", res.data); // 🔹 Log after refresh
                setUser(res.data);
            }
        } else {
            console.error("Session expired, logging out.");
            handleLogout();
        }
    }
}, [refreshAccessToken, handleLogout]); // 🔹 Add missing dependencies



    useEffect(() => {
        fetchUser();
    }, [refreshAccessToken, handleLogout ,fetchUser]); // No more warnings!
    return (
        <div>
            {user ? (
                <>
                    <h1>Welcome, {user.name} ({user.role})</h1>
    
                    <button onClick={connectMetaMask}>Connect MetaMask</button>
                    <p>Ethereum Address: {user.ethereum_address ? user.ethereum_address : "Not connected"}</p>
    
                    {/* Affichage selon le rôle */}
                    {user.role === "simple-user" && (
                        <p>Vous êtes un simple utilisateur, vous n'avez pas d'IPs associées.</p>
                    )}
    
                    {user.role === "ip-owner" && (
                        <div>
                            <h2>Liste des IPs associées :</h2>
                            <ul>
                                {ipList.length > 0 ? (
                                    ipList.map((ip) => <li key={ip.id}>{ip.name}</li>)
                                ) : (
                                    <p>Aucune IP trouvée.</p>
                                )}
                            </ul>
                        </div>
                    )}
    
                    {user.role === "admin" && (
                        <div>
                            <h2>Liste des administrateurs :</h2>
                            <ul>
                                {adminList.length > 0 ? (
                                    adminList.map((admin) => <li key={admin.id}>{admin.name}</li>)
                                ) : (
                                    <p>Aucun administrateur trouvé.</p>
                                )}
                            </ul>
                        </div>
                    )}
    
                    <button onClick={handleLogout}>Logout</button> {/* 🔹 Logout Button */}
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
    
}

export default Dashboard;
