import { AtpAgent, BskyAgent } from "@atproto/api";
import { serviceUriAtom } from "./store/agent";

export const SESSION_LOCAL_STORAGE_KEY = "arta";
export const SERVICE_LOCAL_STORAGE_KEY = "service";

const agent = new BskyAgent({
    service: (() => {
        const serviceUrl = localStorage.getItem(SERVICE_LOCAL_STORAGE_KEY) || "https://bsky.social";
        return serviceUrl
    })(),
    persistSession: (evt, session) => {
        if (session) {
            localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(session));
        }
    },
});

// @ts-ignore
agent.changeService = function (url: string) {
    localStorage.setItem(SERVICE_LOCAL_STORAGE_KEY, url);
    this.service = new URL(url);
    this.api = this.api._baseClient.service(url);
};


export const handleSession = () => {
    const storageValue = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);
    if (storageValue && storageValue != 'undefined') {
        const token = JSON.parse(localStorage.getItem(SESSION_LOCAL_STORAGE_KEY)!);
        if (token) {
            agent.resumeSession(token);
        }
    } else {
        localStorage.removeItem(SESSION_LOCAL_STORAGE_KEY)
        return null;
    }
};

export default agent;