import React from "react";

function UserIpList({ ipList }) {
    return (
        <div>
            <h2>Liste des IPs associées :</h2>

            {ipList.length > 0 ? (
                <ul>
                    {ipList.map((ip) => <li key={ip.id}>{ip.name}</li>)}
                </ul>
            ) : (
                <p>a completer
                    .</p>
            )}
        </div>
    );
}

export default UserIpList;
