import { useAtom } from 'jotai';
import { useCallback, useRef } from 'react';
import { Portal } from 'react-portal';
import { useQuery } from 'react-query';
import { enabled } from 'store';
import agent from '../../Agent';
import SearchIcon from '../../assets/search.svg';
import { searchAtom } from '../../store/search';
import Loading from '../Loading';
import styles from './Search.module.scss';
import User from './User';

export default function Search(props: {}) {
    const [search, setSearch] = useAtom(searchAtom);
    const timeoutRef = useRef<any>(null);
    const { data, isLoading, refetch, isFetching } = useQuery(["search", search.text], useCallback(() => agent.searchActors({
        term: search.text,
        limit: 50
    }), [search.text]), {
        enabled: false
    });

    const _fetchData = () => {
        refetch();
    };

    const _handleChange = (e: any) => {
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);

        setSearch(prev => ({ ...prev, text: e.target.value }));
        timeoutRef.current = setTimeout(_fetchData, 500);
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.inputWrapper}>
                    <div className={styles.icon}>
                        <img src={SearchIcon} alt="Search" />
                    </div>
                    <input type="text" onFocus={() => setSearch(prev => ({...prev, show:true}))} placeholder="Search" className={styles.input} onChange={_handleChange} value={search.text} />
                </div>
                {search.show && search.text.length ? <div className={styles.resultWrapper}>
                    <div className={styles.result}>
                        {isLoading || !data?.data.actors.length ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                            data?.data.actors.map(user => <User key={user.did} user={user} />)
                        }
                    </div>
                </div> : ''}
            </div>
            {!search.show || !search.text.length ? '' : 
                <div className={styles.overlay} onClick={() => setSearch(prev => ({ ...prev, show: false }))}></div>
            
            }
        </>
    );
}