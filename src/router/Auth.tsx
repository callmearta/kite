import React from "react";
import { Navigate } from "react-router-dom";
import agent, { SESSION_LOCAL_STORAGE_KEY } from "../Agent";

export default function Auth (props: {
    children: React.ReactNode
}): React.ReactElement {
    const { children } = props;
    const hasSession = !!localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);

    // @ts-ignore
    return hasSession ? children : <Navigate to="/login" />;
}