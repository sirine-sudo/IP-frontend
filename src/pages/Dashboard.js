import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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

                    <button onClick={handleLogout}>Logout</button> {/* 🔹 Logout Button */}
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}

export default Dashboard;
