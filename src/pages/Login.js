import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            console.log("API Response:", res); //  Debug response
            
            if (res && res.accessToken && res.refreshToken) {
                localStorage.setItem("token", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                console.log("Stored Access Token:", localStorage.getItem("token"));
                console.log("Stored Refresh Token:", localStorage.getItem("refreshToken"));
                alert("Login successful!");
                navigate("/dashboard");
            } else {
                console.error("Unexpected response format:", res);
                alert("Unexpected response format. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
