import { AppBskyFeedGetTimeline } from '@atproto/api';
import { FeedViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SESSION_LOCAL_STORAGE_KEY, default as agent, default as atp } from '../../Agent';
import Blue from '../../components/Blue/Blue';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Sidebar from '../../components/Sidebar/Sidebar';
import { uiAtom } from '../../store/ui';
import Firehose from './Firehose';
import SkyCol from './SkyCol';
import Skyline from './Skyline';

export default function Feed(props: {}) {
    const ui = useAtomValue(uiAtom);

    useEffect(() => {
        if(ui.hot || ui.firehose){
            document.body.classList.add('hot-col');
        }else if(document.body.classList.contains('hot-col')){
            document.body.classList.remove('hot-col');
        }

        return () => {
            document.body.classList.remove('hot-col');
        }
    },[ui.hot]);

    return (
        <Layout className='home'>
            <Skyline />
            {ui.hot ? <SkyCol /> : ''}
            {ui.firehose ? <Firehose /> : ''}
        </Layout>
    );
}