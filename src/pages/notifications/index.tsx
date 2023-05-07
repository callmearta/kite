import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import agent from "../../Agent";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { notificationsAtom } from "../../store/notifications";
import Notification from "./Notification";
import styles from './Notification.module.scss';

export default function Notifications(props: {}) {

    const queryClient = useQueryClient();
    const { data, isLoading, isFetching } = useQuery(["notifications"], () => agent.listNotifications({}), {
        refetchOnWindowFocus: false,
        refetchInterval: 5000,
        onSuccess: async d => {
            if (d.data?.notifications?.filter(i => !i.isRead).length)
                _updateSeen();
            const locNotifs = d.data?.notifications;
            const uniqueUris = [...new Set(locNotifs?.filter(
                i => i.reason == 'mention' ||
                    i.reason == 'like' ||
                    i.reason == 'reply' ||
                    i.reason == 'repost'
            ).map(i => (i?.record as any)?.subject?.uri)?.filter(i => i && typeof i != 'undefined'))];

            if (uniqueUris.length) {
                const chunkSize = 25;
                for (let i = 0; i < uniqueUris.length; i += chunkSize) {
                    const chunk = uniqueUris.slice(i, i + chunkSize);

                    const result = await agent.api.app.bsky.feed.getPosts({
                        uris: chunk
                    });

                    let newNotifs = [...locNotifs];
                    for (let i = 0; i < newNotifs.length; i++) {
                        const post = newNotifs[i];
                        let notifIndex = result.data.posts.findIndex(i => (post.reasonSubject) == i.uri);
                        if (notifIndex > -1) {
                            // if(post.reason == 'quote')
                            newNotifs[i].post = result.data.posts[notifIndex];
                        }
                    }
                    setNotifs(newNotifs);
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setNotifs(locNotifs);
            }
        }
    });
    const [loading, setLoading] = useState(isLoading && isFetching);
    const [notifs, setNotifs] = useAtom(notificationsAtom);

    const _updateSeen = async () => {
        const result = await agent.updateSeenNotifications();
        if (result.success) {
            queryClient.invalidateQueries(["notifications"]);
        }
    };

    const notifGroups = useMemo(() => {
        // @ts-ignore
        let groups = notifs.reduce((p1, p2) => {
            if ((p2.record as any)?.subject?.uri) {
                // @ts-ignore
                const exists = p1.findIndex(i => i.reason == p2.reason && i.subjectUri == p2.record.subject.uri);
                if (exists > -1) {
                    // @ts-ignore
                    p1[exists].datas.push(p2);
                    return p1;
                } else {
                    const newData = {
                        // @ts-ignore
                        subjectUri: p2.record.subject.uri,
                        reason: p2.reason,
                        post: p2.post || p2.record,
                        datas: [p2]
                    };
                    return [...p1, newData];
                }
            } else {
                if (p2.reason == 'follow') {
                    // @ts-ignore
                    const exists = p1.findIndex(i => i.reason == 'follow');
                    if (exists > -1) {
                        // @ts-ignore
                        p1[exists].datas.push(p2);
                        return p1;
                    }
                }
                return [...p1, {
                    subjectUri: p2.uri,
                    reason: p2.reason,
                    post: p2.post || p2.record,
                    datas: [p2]
                }];
            }
        }, [])

        if (!groups || groups.length) return groups;
        // @ts-ignore
        groups = groups?.filter((i, index) => i.subjectUri && groups.findIndex(p => p.subjectUri && p.subjectUri == i.subjectUri) == index);
        return groups;
    }, [notifs]);

    return (
        <Layout>
            <h1>Notifications</h1>
            {loading ?
                <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div>
                : <div className={styles.notifications}>{
                    // @ts-ignore
                    notifGroups.map(notif =>
                        <Notification key={notif.datas[0].cid} notif={notif} />
                    )}</div>}
        </Layout>
    );
}