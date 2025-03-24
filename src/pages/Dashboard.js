import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, logoutUser, connectWallet } from "../api/userApi";
import UserInfo from "../components/UserInfo";
import UserIpList from "../components/UserIpList";
import AdminList from "../components/AdminList";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [UserIpList, setUserIpList] = useState([]);
    const [adminList, setAdminList] = useState([]);

    const navigate = useNavigate();

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
        if (userData.role === "ip-owner") {
            setUserIpList(userData.ips || []);
        } else if (userData.role === "admin") {
            setAdminList(userData.admins || []);
        }
    }, [handleLogout]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div>
            {user ? (
                <>
                    <UserInfo user={user} onConnectWallet={() => connectWallet(fetchUser)} />
                    
                    {user.role === "ip-owner" && <UserIpList UserIpList={UserIpList} />}
                    {user.role === "admin" && <AdminList adminList={adminList} />}
                    
                    <button onClick={() => navigate("/marketplace")}>Aller à la Marketplace</button>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}

export default Dashboard;
