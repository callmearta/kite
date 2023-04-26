import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import agent, { SESSION_LOCAL_STORAGE_KEY } from "../../Agent";

export default function Logout(props: {}) {
    const _logout = () => {
        localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
    };

    useEffect(() => {
        _logout();
    }, []);

    return <Navigate to="/login" />;
}