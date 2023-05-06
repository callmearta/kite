import cn from 'classnames';
import { useAtomValue } from 'jotai';
import { useQuery } from 'react-query';
import agent from '../../../Agent';
import Loading from '../../../components/Loading';
import { userAtom } from '../../../store/user';
import Fleet from './Fleet';
import styles from './Fleet.module.scss';
import New from './New';

export default function Fleets(props: {}) {
    const user = useAtomValue(userAtom);
    const { data, isLoading } = useQuery("fleets", () => _fetchFleets(), {
        cacheTime: Infinity,
        refetchOnWindowFocus:false
    });

    const _fetchFleets = async () => {
        let fleets: any[] = [];
        const followings = await agent.getFollows({
            actor: user?.handle!,
            limit:100
        });
        await Promise.all(
            [user, ...followings.data.follows.splice(0, 300)].map(async user => {
                const result = await agent.com.atproto.repo.listRecords({
                    collection: 'app.bsky.actor.profile',
                    repo: user?.did!,
                    limit: 10
                });
                const userFleets = result.data.records.filter(record => {
                    // @ts-ignore
                    if(!record.value.createdAt) return;
                    // @ts-ignore
                    const diffTime = Math.abs(new Date(record.value.createdAt).valueOf() - Date.now());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60));
                    // @ts-ignore
                    return record.value.kiteType && record.value.avatar && record.value.kiteType == 'fleet' && record.value.createdAt && diffDays <= 24
                });
                if (!userFleets.length) return;
                fleets.push({
                    user: user,
                    data: userFleets
                });
            })
        );
        return fleets;
    };

    return (
        <div className={styles.fleets}>
            <div className={styles.inner}>
                <New />
                {isLoading ? <Loading isColored /> : data?.map(i => <Fleet key={i.user.did} record={i} />)}
            </div>
        </div>
    );
}