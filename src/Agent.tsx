import { AtpAgent, BskyAgent } from "@atproto/api";

export const SESSION_LOCAL_STORAGE_KEY = "arta";

const agent = new BskyAgent({
    service: "https://bsky.social",
    persistSession: (evt, session) => {
        if (session) {
            localStorage.setItem(SESSION_LOCAL_STORAGE_KEY, JSON.stringify(session));
        }
    },
});

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