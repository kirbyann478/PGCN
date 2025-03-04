import { useState, useEffect } from "react";

const FetchLocalUserDetails = () => {
    const [localUserDetails, setLocalUserDetails] = useState(null);

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setLocalUserDetails(JSON.parse(storedUser));
        }
    }, []);

    return { localUserDetails };
};

export default FetchLocalUserDetails;
