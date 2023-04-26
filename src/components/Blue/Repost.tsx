import { FeedViewPost, PostView } from 'atproto/packages/api/dist/client/types/app/bsky/feed/defs';
import { SyntheticEvent, useCallback, useState } from 'react';
import agent from '../../Agent';
import RepostFillIcon from '../../assets/repost-fill.svg';
import RepostIcon from '../../assets/repost.svg';
import styles from './Blue.module.scss';

export default function Repost(props: {
    post: FeedViewPost | PostView
}) {
    const { post } = props;
    const [hasReposted, setHasReposted] = useState(typeof (post.viewer as any)?.repost != 'undefined');
    const [repostCount, setRepostCount] = useState(post.repostCount);
    const [repostUri, setRepostUri] = useState((post.viewer as any)?.repost || '');
    const [loading,setLoading] = useState(false);

    const _handleRepost = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(loading) return;
        const currentReposted = hasReposted;
        const currentRepostCount = repostCount as number;
        setLoading(true);
        setHasReposted(prev => !prev);
        if (!currentReposted) {
            try {
                setRepostCount(currentRepostCount + 1);
                const result = await agent.repost((post.uri as string), (post.cid as string));
                setLoading(false);
                setRepostUri(result.uri);
            }
            catch (error) {
                console.error(error);
                setRepostCount(currentRepostCount);
            }
        } else {
            try {
                setRepostCount(currentRepostCount - 1);
                const result = await agent.deleteRepost(repostUri);
                setLoading(false);
            }
            catch (error) {
                console.error(error);
                setRepostCount(currentRepostCount);
            }

        }
    }, [hasReposted, repostCount, repostUri, loading]);

    return (
        <button className={styles.repost} type="button" >
            <div className={styles.icon} onClick={_handleRepost}>
                <img src={hasReposted ? RepostFillIcon : RepostIcon} alt="" />
            </div>
            {// @ts-ignore
                repostCount > 0 ? <span>{repostCount}</span> : ''}
        </button>
    );
}