import React from "react";

function UserInfo({ user, onConnectWallet }) {
    return (
        <div>
            <h1>Welcome, {user.name} ({user.role})</h1>
            <button onClick={onConnectWallet}>Connect MetaMask</button>
            <p>Ethereum Address: {user.ethereum_address || "Not connected"}</p>
        </div>
    );
}

export default UserInfo;
