import { useEffect, useState } from "react";

function DashboardContent(){
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/accounts")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data); // ✅ Log the data
                setUsers(data);
            })
            .catch(error => console.error("Error fetching accounts:", error));
    }, []);

    return(
        <> 
            <div>
                <h1>Hello</h1>
                <h2>Users:</h2>
                <ul>
                    {users.length > 0 ? (
                        users.map(user => 
                        <li key={user.id}>{user.email} {user.password}</li>
                    )
                    ) : (
                        <li>No data found</li> // ✅ Display message if empty
                    )}
                </ul>
            </div>
        </>
    )

}

export default DashboardContent
