import { AppBskyFeedGetTimeline } from '@atproto/api';
// @ts-ignore
import { FeedViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import cn from 'classnames';
import { useAtom } from 'jotai';
import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import agent from '../../Agent';
import CloseIcon from '../../assets/close.svg';
import Loading from '../../components/Loading';
import PostsRenderer from '../../components/PostsRenderer';
import { UI_STORAGE_KEY, uiAtom } from '../../store/ui';
import styles from './Feed.module.scss';

export default function SkyCol(props: {}) {
    const page = useRef<any>(null);
    const refetchRef = useRef<any>(null);
    const colRef = useRef<any>(null);
    const [newPosts, setNewPosts] = useState<Array<any>>([]);
    const [ui, setUi] = useAtom(uiAtom);

    const _fetchFeed = async (pageParam: any) => {
        // if(pageParam)
        //     page.current= (pageParam || null);
        const feed: AppBskyFeedGetTimeline.Response = await agent.api.app.bsky.unspecced.getPopular({
            // algorithm: "reverse-chronological",
            cursor: pageParam
        });
        if (pageParam)
            page.current = feed.data.cursor;
        return feed;
    }
    const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(["hotcol"], ({ pageParam }) => _fetchFeed(pageParam), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: Infinity,
        onSuccess: d => {
            const lastPage = d.pages[d.pages.length - 1];
            if (
                !feed.length
                || page.current != d.pages[d.pages.length - 1].data.cursor

                // If we have feed data and our first post is same as fetched data's first page's first post it means there's no new data and also the data is not coming from pagination
                // and also we check our last page's last post with fetched data's last page's last post to check if this data is from pagination and if so we append it to the feed
                || (feed.length && feed[0].post.uri == d.pages[0].data.feed[0].post.uri && feed[feed.length - 1].post.uri != lastPage.data.feed[lastPage.data.feed.length - 1].post.uri)
            ) {
                setFeed([...feed, ...d.pages[d.pages.length - 1].data.feed]);
            } else {
                _handleNewPosts(d.pages[0].data.feed)
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.cursor ? lastPage.data.cursor : undefined;
        }
    });

    const [feed, setFeed] = useState<any>(data?.pages[0]?.data.feed || []);

    const _handleNewPosts = useCallback((data: FeedViewPost[]) => {
        const samePost = data[0].post.uri == feed[0].post.uri;

        if (!samePost) {
            setNewPosts(data);
        }
    }, [feed]);

    const _handleRefetch = () => {
        refetchRef.current = setTimeout(() => {
            refetch({ refetchPage: (page, index) => index === 0 });
            _handleRefetch();
        }, 20000);
    };

    useEffect(() => {
        _handleRefetch();

        return () => {
            clearTimeout(refetchRef.current);
        };
    }, []);

    useEffect(() => {
        let fetching = false;
        const handleScroll = async (e: any) => {
            const { scrollHeight, scrollTop, clientHeight } = colRef.current;
            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true
                if (hasNextPage) await fetchNextPage()
                fetching = false
            }
        }
        if(colRef.current)
        colRef.current.addEventListener('scroll', handleScroll)
        return () => {
            if(colRef.current)
            colRef.current.removeEventListener('scroll', handleScroll)
        }
    }, [fetchNextPage, hasNextPage])

    const _handleNewPostsClick = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const currentNewPosts = [...newPosts];
        setFeed(currentNewPosts);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
        setNewPosts([]);
    };

    const _handleClose = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setUi(prev => ({ ...prev, hot: false }));
        localStorage.setItem(UI_STORAGE_KEY, JSON.stringify({ ...ui, hot: false }));
    };

    return (
        <div ref={colRef} className="skyline skycol">
            {newPosts.length ? <button onClick={_handleNewPostsClick} className={cn("btn primary", styles.newPosts)}>New Posts</button> : ''}
            <div className="col-header">
                <h1>What's Hot?</h1>
                <button className="icon-btn" onClick={_handleClose}>
                    <img src={CloseIcon} alt="Close" />
                </button>
            </div>
            <PostsRenderer isLoading={isLoading} feed={feed} />
            {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
        </div>
    );
}