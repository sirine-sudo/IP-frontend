import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const loginUser = async (userData) => {
    const res = await axios.post(`${API_URL}/login`, userData);
    return res.data;
};

export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const forgotPassword = async (email) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = async (data) => {
    return axios.post(`${API_URL}/reset-password`, data);
};
