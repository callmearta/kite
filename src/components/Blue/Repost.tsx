import { FeedViewPost, PostView } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { useSetAtom } from 'jotai';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Portal } from 'react-portal';
import agent from '../../Agent';
import QuoteIcon from '../../assets/quote.svg';
import RepostFillIcon from '../../assets/repost-fill.svg';
import RepostIcon from '../../assets/repost.svg';
import { newAtom } from '../../store/new';
import styles from './Blue.module.scss';

export default function Repost(props: {
    post: FeedViewPost | PostView
}) {
    const { post } = props;
    const setNewModal = useSetAtom(newAtom);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasReposted, setHasReposted] = useState(typeof (post.viewer as any)?.repost != 'undefined');
    const [repostCount, setRepostCount] = useState(post.repostCount);
    const [repostUri, setRepostUri] = useState((post.viewer as any)?.repost || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRepostCount(post.repostCount);
        setHasReposted((post.viewer as any)?.repost)
        setRepostUri((post.viewer as any)?.repost)
    }, [post.repostCount, (post.viewer as any)?.repost]);

    const _handleRepost = useCallback(async (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        const currentReposted = hasReposted;
        const currentRepostCount = repostCount as number;
        setDropdownOpen(false);
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

    const _handleDropdown = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setDropdownOpen(prev => !prev);
    };

    const _handleQuote = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setDropdownOpen(false);
        setNewModal({
            show: true,
            quotePost: post as any
        });
    }

    return (
        <>
            <button className={styles.repost} type="button">
                <div className={styles.icon} onClick={_handleDropdown}>
                    <img src={hasReposted || dropdownOpen ? RepostFillIcon : RepostIcon} alt="" />
                </div>
                {// @ts-ignore
                    repostCount > 0 ? <span>{repostCount}</span> : ''}
                {dropdownOpen ? <div className={styles.repostDropdown}>
                    <p className="font-weight-bold" onClick={_handleRepost}>
                        <img src={RepostIcon} alt="" />
                        <span>Repost</span>
                    </p>
                    <p className="font-weight-bold" onClick={_handleQuote}>
                        <img src={QuoteIcon} alt="" />
                        <span>Quote</span>
                    </p>
                </div> : ''}
            </button>
            {dropdownOpen ? <Portal>
                <div className={styles.repostBackdrop} onClick={_handleDropdown}></div>
            </Portal> : ''}
        </>
    );
}