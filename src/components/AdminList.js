import React from "react";

function AdminList({ adminList }) {
    return (
        <div>
            <h2>Liste des administrateurs :</h2>
            {adminList.length > 0 ? (
                <ul>
                    {adminList.map((admin) => <li key={admin.id}>{admin.name}</li>)}
                </ul>
            ) : (
                <p>Aucun administrateur trouvé.</p>
            )}
        </div>
    );
}

export default AdminList;
