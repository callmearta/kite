import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Navigate } from "react-router-dom";
import agent, { SERVICE_LOCAL_STORAGE_KEY, SESSION_LOCAL_STORAGE_KEY } from "../../Agent";

export default function Logout(props: {}) {
    const queryClient = useQueryClient();
    const _logout = () => {
        localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY);
        localStorage.removeItem(SERVICE_LOCAL_STORAGE_KEY);
        queryClient.clear();
        // @ts-ignore
        agent.changeService("https://bsky.social");
    };

    useEffect(() => {
        _logout();
    }, []);

    return <Navigate to="/login" />;
}