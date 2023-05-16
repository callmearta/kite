import { FeedViewPost, PostView } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import cn from 'classnames';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import agent from '../../Agent';
import HeartFillIcon from '../../assets/like-fill.svg';
import HeartIcon from '../../assets/like.svg';
import Loading from '../Loading';
import styles from './Blue.module.scss';

export default function Like(props: {
    post: PostView | FeedViewPost
}) {
    const { post } = props;
    const [liked, setLiked] = useState<boolean>(typeof (post.viewer as any)?.like != 'undefined');
    const [likeUri, setLikeUri] = useState<boolean | string>((post.viewer as any)?.like || '');
    const [likeCount, setLikeCount] = useState<number>((post.likeCount as number));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLikeCount(post.likeCount as number);
        setLiked((post.viewer as any)?.like)
        setLikeUri((post.viewer as any)?.like)
    }, [post.likeCount, (post.viewer as any)?.like]);

    const _handleLike = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        // @ts-ignore
        setLiked(prev => !prev);
        setLoading(true);
        const currentLikeCount = likeCount;
        if (!liked) {
            setLikeCount(currentLikeCount + 1);
            try {
                const result = await agent.like((post.uri as string), (post.cid as string));
                setLikeUri(result.uri);
                setLoading(false);
            }
            catch (error) {
                console.error(error);
                setLikeCount(currentLikeCount);
            }
        } else {
            setLikeCount(prev => prev - 1);
            try {
                const result = await agent.deleteLike((likeUri as string));
                setLoading(false);
            }
            catch (error) {
                console.error(error);
                setLikeCount(currentLikeCount);
            }
        }
    }, [liked, likeCount, likeUri, loading]);

    return (
        <button className={styles.like} >
            <div className={styles.icon} onClick={_handleLike}>
                <img src={liked ? HeartFillIcon : HeartIcon} alt="" />
            </div>
            {likeCount ? <span>{likeCount as number}</span> : ''}
        </button>
    );
}