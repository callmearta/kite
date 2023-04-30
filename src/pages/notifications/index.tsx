import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import agent from "../../Agent";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { notificationsAtom } from "../../store/notifications";
import Notification from "./Notification";
import styles from './Notification.module.scss';

export default function Notifications(props: {}) {
    
    const queryClient = useQueryClient();
    const { data,isLoading, isFetching } = useQuery(["notifications"], () => agent.listNotifications({}), {
        refetchOnWindowFocus: false,
        refetchInterval: 5000,
        onSuccess: async d => {
            if(d.data.notifications.filter(i => !i.isRead).length)
                _updateSeen();
            const locNotifs = d.data.notifications;
            const uniqueUris = [...new Set(locNotifs.filter(
                i => i.reason == 'mention' ||
                    i.reason == 'like' ||
                    i.reason == 'reply' ||
                    i.reason == 'repost'
            ).map(i => (i?.record as any)?.subject?.uri).filter(i => i && typeof i != 'undefined'))];

            const chunkSize = 25;
            for (let i = 0; i < uniqueUris.length; i += chunkSize) {
                const chunk = uniqueUris.slice(i, i + chunkSize);
                // do whatever
                const result = await agent.api.app.bsky.feed.getPosts({
                    uris: chunk
                });
    
                let newNotifs = [...locNotifs];
                for (let i = 0; i < newNotifs.length; i++) {
                    const post = newNotifs[i];
                    let notifIndex = result.data.posts.findIndex(i => (post.record as any).subject?.uri == i.uri);
                    if (notifIndex > -1) {
                        newNotifs[i].post = result.data.posts[notifIndex];
                    }
                }
                setNotifs(newNotifs);
                setLoading(false);
            }
        }
    });
    const [loading, setLoading] = useState(isLoading && isFetching);
    const [notifs, setNotifs] = useAtom(notificationsAtom);

    const _updateSeen = async () => {
        const result = await agent.updateSeenNotifications();
        if(result.success){
            queryClient.invalidateQueries(["notifications"]);
        }
    };

    return (
        <Layout>
            <h1>Notifications</h1>
            {loading ?
                <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div>
                : <div className={styles.notifications}>{notifs.map(notif =>
                    <Notification key={notif.cid} notif={notif} />
                )}</div>}
        </Layout>
    );
}