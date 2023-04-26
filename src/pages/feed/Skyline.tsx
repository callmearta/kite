import { AppBskyFeedGetTimeline } from 'atproto/packages/api';
// @ts-ignore
import { FeedViewPost } from 'atproto/packages/api/dist/client/types/app/bsky/feed/defs';
import cn from 'classnames';
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import agent from '../../Agent';
import PostsRenderer from '../../components/PostsRenderer';
import styles from './Feed.module.scss';
import New from './New';

export default function Skyline(props: {}) {
    const [page, setPage] = useState(1);
    const [newPosts, setNewPosts] = useState<Array<any>>([]);

    const _fetchFeed = async () => {
        const feed: AppBskyFeedGetTimeline.Response = await agent.getTimeline({
            algorithm: "reverse-chronological"
        });
        return feed;
    }
    const { data, isLoading } = useQuery(["skyline", page], _fetchFeed, {
        refetchInterval: 10000,
        onSuccess: d => {
            if (!feed.length) {
                setFeed(d.data.feed);
            } else {
                _handleNewPosts(d.data.feed)
            }
        }
    });

    const [feed, setFeed] = useState(data?.data.feed || []);

    const _handleNewPosts = useCallback((data: FeedViewPost[]) => {
        const samePost = data[0].post.uri == feed[0].post.uri;
        
        if (!samePost){
            setNewPosts(data);
        }
    },[feed]);

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
        </div>
    );
}