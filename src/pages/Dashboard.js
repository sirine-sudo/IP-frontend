import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 🔹 Function to handle logout
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");  // Clear Access Token
        localStorage.removeItem("refreshToken"); // Clear Refresh Token
        navigate("/");  // Redirect to Login Page
    }, [navigate]); // ✅ Added `navigate` as a dependency

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
            handleLogout(); // ✅ Using `handleLogout`
            return null;
        }
    }, [handleLogout]); // ✅ Added `handleLogout` as a dependency

    useEffect(() => {
        const fetchUser = async () => {
            let token = localStorage.getItem("token");

            try {
                const res = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    console.warn("Access token expired. Refreshing...");
                    token = await refreshAccessToken();
                    if (token) {
                        const res = await axios.get("http://localhost:5000/api/users/profile", {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setUser(res.data);
                    }
                } else {
                    console.error("Session expired, logging out.");
                    handleLogout(); // ✅ Using `handleLogout`
                }
            }
        };

        fetchUser();
    }, [refreshAccessToken, handleLogout]); // ✅ Added `handleLogout` as a dependency

    return (
        <div>
            {user ? (
                <>
                    <h1>Welcome, {user.name} ({user.role})</h1>
                    <button onClick={handleLogout}>Logout</button> {/* 🔹 Logout Button */}
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}

export default Dashboard;
