import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Adjust if your backend URL is different

export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData);

};



export const forgotPassword = async (email) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = async (data) => {
    return axios.post(`${API_URL}/reset-password`, data);
};

export const loginUser = async (userData) => {
    const res = await axios.post(`${API_URL}/login`, userData);
    localStorage.setItem("role", res.data.role); // "admin", "simple-user", etc.

    return res.data;  
};
