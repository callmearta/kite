import { ProfileView, ProfileViewDetailed } from '@atproto/api/src/client/types/app/bsky/actor/defs';
import cn from 'classnames';
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
import Donate from './Donate';
import styles from './Right.module.scss';
import Search from './Search';
import User from './User';

export default function Right(props: {
    isInSkyline?: boolean
}) {
    const { isInSkyline } = props;
    const user = useAtomValue(userAtom);
    const settings = useAtomValue(settingsAtom);
    const [suggested, setSuggested] = useAtom(SuggestedAtom);
    const [personalizedDone, setPersonalizedDone] = useState(false);
    const { data: followingData, isLoading: followingLoading, status } = useQuery(["following", 1], () => agent.getFollows({ actor: user?.did!, limit: 20 }), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onSuccess: async d => {
            setPersonalizedDone(false);
            await Promise.all(
                d.data.follows.map(async user => {
                    try {
                        const result = await agent.getFollows({ actor: user.did, limit: 10 });
                        if (result.data.follows) {
                            setSuggested((prev): any => {
                                return { ...prev, filteredList: [], loading: true, data: [...prev.data, ...result.data.follows] };
                            });
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }
                })
            );
            setPersonalizedDone(true);
        },
        enabled: settings.suggested == 'personalized'
    });
    const { data: followingDataGlobal, isLoading: followingLoadingGlobal } = useQuery(["followingGlobal", 1], () => agent.api.app.bsky.actor.getSuggestions({ limit: 6 }), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onSuccess: d => {
            setSuggested(prev => ({ filteredList: [], data: d.data.actors, loading: false }));
        },
        enabled: settings.suggested == 'global'
    });

    const _handleList = async () => {
        const sort = await Promise.all(
            suggested.data?.filter((p: any, index) => suggested.data.findIndex((i: any) => i.did == p.did) != index ? null : p)
                .filter(p => blacklist(p)).filter((p: any) => !p.viewer.following && p.did != user?.did)
                .map(value => ({ value, sort: Math.random() }))
                .reverse()
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value).splice(0, 6)
        );

        setSuggested(prev => ({ ...prev, filteredList: sort, loading: false }));
    };

    useEffect(() => {
        if (suggested.data.length && status == 'success' && !suggested.filteredList.length && settings.suggested == 'personalized' && personalizedDone) {
            _handleList();
        }
    }, [suggested.data, settings.suggested]);


    return (
        isInSkyline ?
            <div className={cn(styles.suggested, { [styles.inSkyline]: isInSkyline })}>
                <h4>Who To Follow?</h4>
                <p>Here you'll see a list of new people to follow</p>
                {suggested.loading || followingLoading || followingLoadingGlobal ?
                    <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                    <div>
                        {(settings.suggested == 'personalized' ? suggested.filteredList : suggested.data).map(p =>
                            <User key={(p as any).did} user={p} />
                        )}
                    </div>
                }
            </div>
            : <div className={cn(styles.right)}>
                <Search />
                <div className={styles.suggested}>
                    <h4>Who To Follow?</h4>
                    <p>Here you'll see a list of new people to follow</p>
                    {suggested.loading || followingLoading || followingLoadingGlobal ?
                        <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                        <div>
                            {(settings.suggested == 'personalized' ? suggested.filteredList : suggested.data).map(p =>
                                <User key={(p as any).did} user={p} />
                            )}
                        </div>
                    }
                </div>
                <div className={styles.copy}>
                    <Donate />
                    <p>Donations received since beginning: <b>$0.00</b></p>
                    <p>Version 0.1.2</p>
                    <p>Developed by <Link to="/user/arta.bsky.social">Arta</Link></p>
                    <div className={styles.icon}>
                        <a href="https://github.com/callmearta/kite" title="Kite | BlueSky Web Client" target="_blank">
                            <img src={GithubIcon} alt="" />
                        </a>
                    </div>
                </div>
            </div>
    );
}