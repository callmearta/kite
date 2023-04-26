import { AppBskyFeedGetTimeline } from '@atproto/api';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import agent from '../../Agent';
import Blue from '../../components/Blue/Blue';
import Loading from '../../components/Loading';
import PostsRenderer from '../../components/PostsRenderer';
import New from './New';

export default function Skyline(props: {}) {
    const [page, setPage] = useState(1);
    
    const _fetchFeed = async () => {
        const feed: AppBskyFeedGetTimeline.Response = await agent.getTimeline({
            algorithm: "reverse-chronological"
        });
        return feed;
    }
    const { data, isLoading } = useQuery(["skyline", page], _fetchFeed,{
        refetchInterval:5000,
        onSuccess: d => {
            setFeed(d.data.feed);
        }
    });
    
    const [feed,setFeed] = useState(data?.data.feed || []);
    
    return (
        <div className="skyline">
            <h1>Skyline</h1>
            <New/>
            <PostsRenderer isLoading={isLoading} feed={feed} />
        </div>
    );
}