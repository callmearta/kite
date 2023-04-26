import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import agent from '../../Agent';
import GithubIcon from '../../assets/github.svg';
import { SuggestedAtom } from '../../store/suggested';
import { userAtom } from '../../store/user';
import Loading from '../Loading';
import styles from './Right.module.scss';
import User from './User';

export default function Right(props: {}) {
    const user = useAtomValue(userAtom);
    const [followings, setFollowings] = useState<Array<any>>([]);
    const [suggested,setSuggested] = useAtom(SuggestedAtom);
    const { data: followingData, isLoading: followingLoading } = useQuery(["following", 1], () => agent.getFollows({ actor: user?.did!, limit: 10 }), {
        cacheTime: -1,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onSuccess: d => {
            d.data.follows.forEach(async user => {
                try {
                    const result = await agent.getFollows({ actor: user.did, limit: 10 });
                    // @ts-ignore
                    setSuggested((prev: Array<any>) => [...prev, ...result.data.follows]);
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
    });

    return (
        <div className={styles.right}>
            <div className={styles.suggested}>
                <h4>Who To Follow?</h4>
                <p>Here you'll see a list of your followings followings :))</p>
                {!suggested.length ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : suggested.filter((p: any, index) => suggested.findIndex((i:any) => i.did == p.did) != index ? null : p).filter((p:any) => !p.viewer.following && p.did != user?.did).splice(0,6).map(p =>
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