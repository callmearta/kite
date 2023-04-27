import { ProfileView, ProfileViewDetailed } from 'atproto/packages/api/src/client/types/app/bsky/actor/defs';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import agent from '../../Agent';
import GithubIcon from '../../assets/github.svg';
import { settingsAtom } from '../../store/settings';
import { SuggestedAtom } from '../../store/suggested';
import { userAtom } from '../../store/user';
import blacklist from '../../utils/blacklist';
import Loading from '../Loading';
import styles from './Right.module.scss';
import User from './User';

export default function Right(props: {}) {
    const user = useAtomValue(userAtom);
    const settings = useAtomValue(settingsAtom);
    const [suggested, setSuggested] = useAtom(SuggestedAtom);
    const { data: followingData, isLoading: followingLoading, status } = useQuery(["following", 1], () => agent.getFollows({ actor: user?.did!, limit: 10 }), {
        // cacheTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onSuccess: d => {
            for (let i = 0; i < d.data?.follows?.length; i++) {
                const user = d.data.follows[i];
                (async () => {
                    try {
                        const result = await agent.getFollows({ actor: user.did, limit: 10 });
                        if (result.data.follows) {
                            setSuggested((prev): any => {
                                if (typeof prev.data != 'undefined') {
                                    return { ...prev, data: [...suggested.data, ...result.data.follows] };
                                } else {
                                    return { ...prev, data: [...result.data.follows] };
                                }
                            });
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }

                })()
            }
        },
        enabled: settings.suggested == 'personalized'
    });
    const { data: followingDataGlobal, isLoading: followingLoadingGlobal } = useQuery(["followingGlobal", 1], () => agent.api.app.bsky.actor.getSuggestions({ limit: 10 }), {
        // cacheTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onSuccess: d => {
            setSuggested(prev => ({ filteredList: [], data: d.data.actors, loading: false }));
        },
        enabled: settings.suggested == 'global'
    });

    useEffect(() => {
        if (suggested.data.length && status == 'success' && !suggested.filteredList.length && settings.suggested == 'personalized') {
            setSuggested(prev => ({
                ...prev,
                loading: false,
                filteredList: suggested.data?.filter((p: any, index) => suggested.data.findIndex((i: any) => i.did == p.did) != index ? null : p)
                    .filter(p => blacklist(p)).filter((p: any) => !p.viewer.following && p.did != user?.did)
                    .map(value => ({ value, sort: Math.random() }))
                    .reverse()
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value).splice(0, 6)
            }));
        }
    }, [suggested.data]);

    return (
        <div className={styles.right}>
            <div className={styles.suggested}>
                <h4>Who To Follow?</h4>
                <p>Here you'll see a list of your followings followings :))</p>
                {suggested.loading || followingLoading || followingLoadingGlobal ?
                    <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                    (suggested.filteredList.length ? suggested.filteredList : suggested.data).map(p =>
                        <User key={(p as any).did} user={p} />
                    )}
            </div>
            <div className={styles.copy}>
                <p>Version 0.0.1</p>
                <p>Developed by <Link to="/user/arta.bsky.social">Arta</Link></p>
                <div className={styles.icon}>
                    <a href="https://github.com/callmearta/kite" title="" target="_blank">
                        <img src={GithubIcon} alt="" />
                    </a>
                </div>
            </div>
        </div>
    );
}