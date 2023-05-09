import React from "react";
import { Navigate, useParams } from "react-router-dom";
import agent, { SESSION_LOCAL_STORAGE_KEY } from "../Agent";

export default function Auth (props: {
    children: React.ReactNode
}): React.ReactElement {
    const params = useParams();
    const { children } = props;
    const hasSession = !!localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);

    // @ts-ignore
    return hasSession ? <React.Fragment key={Object.keys(params).length ? params[Object.keys(params)[0]] : undefined}>{children}</React.Fragment> : <Navigate to="/login" />;
}