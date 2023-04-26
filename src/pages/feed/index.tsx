import { AppBskyFeedGetTimeline } from '@atproto/api';
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SESSION_LOCAL_STORAGE_KEY, default as agent, default as atp } from '../../Agent';
import Blue from '../../components/Blue/Blue';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Sidebar from '../../components/Sidebar/Sidebar';
import Skyline from './Skyline';

export default function Feed(props: {}) {

    return (
        <Layout>
            <Skyline />
        </Layout>
    );
}