import { AppBskyFeedGetTimeline } from 'atproto/packages/api';
// @ts-ignore
import { FeedViewPost } from 'atproto/packages/api/src/client/types/app/bsky/feed/defs';
import cn from 'classnames';
import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import agent from '../../Agent';
import Loading from '../../components/Loading';
import PostsRenderer from '../../components/PostsRenderer';
import styles from './Feed.module.scss';
import New from './New';

export default function Skyline(props: {}) {
    const [page, setPage] = useState('');
    const refetchRef = useRef<any>(null);
    const [newPosts, setNewPosts] = useState<Array<any>>([]);

    const _fetchFeed = async ({ pageParam }: { pageParam: any }) => {
        setPage(pageParam || null);
        const feed: AppBskyFeedGetTimeline.Response = await agent.getTimeline({
            algorithm: "reverse-chronological",
            cursor: pageParam
        });
        return feed;
    }
    const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(["skyline"], ({pageParam}) => _fetchFeed({pageParam}), {
        onSuccess: d => {
            if ((!feed.length || page != d.pages[d.pages.length-1].data.cursor) && feed[0].post.uri == d.pages[0].data.feed[0].post.uri) {
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
        },5000);
    };

    useEffect(() => {
        _handleRefetch();

        return () => {
            clearTimeout(refetchRef.current);
        };
    },[]);

    useEffect(() => {
        let fetching = false;
        const handleScroll = async (e: any) => {
            const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;
            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true
                if (hasNextPage) await fetchNextPage()
                fetching = false
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('scroll', handleScroll)
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

    return (
        <div className="skyline">
            {newPosts.length ? <button onClick={_handleNewPostsClick} className={cn("btn primary", styles.newPosts)}>New Posts</button> : ''}
            <h1>Skyline</h1>
            <New />
            <PostsRenderer isLoading={isLoading} feed={feed} />
            {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
        </div>
    );
}