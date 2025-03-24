import axios from "axios";
import Web3 from "web3";

const API_URL = "http://localhost:5000/api/users";

export const fetchUserProfile = async () => {
    let token = localStorage.getItem("token");

    try {
        const res = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error) {
        if (error.response?.status === 401) {
            token = await refreshAccessToken();
            if (token) {
                const res = await axios.get(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return res.data;
            }
        }
        return null;
    }
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return null;

    try {
        const response = await axios.post("http://localhost:5000/api/refresh-token", {
            refreshToken,
        });

        if (response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken);
            return response.data.accessToken;
        }
    } catch (error) {
        console.error("Erreur lors du refresh token:", error);
    }

    return null;
};

export const logoutUser = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
        await axios.post(`${API_URL}/logout`, { token: refreshToken });
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
};

export const connectWallet = async (fetchUser) => {
    if (window.ethereum) {
        try {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();

            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/connect-wallet`,
                { ethereum_address: accounts[0] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Wallet Connected Successfully!");
            fetchUser();
        } catch (error) {
            console.error("MetaMask connection error:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install it to proceed.");
    }
};
