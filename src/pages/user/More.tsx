import { useState } from 'react';
import { Portal } from 'react-portal';
import { useMutation, useQueryClient } from 'react-query';
import agent from '../../Agent';
import BlockIcon from '../../assets/block.svg';
import MoreIcon from '../../assets/dots.svg';
import Loading from '../../components/Loading';
import styles from './User.module.scss';

export default function More(props: {
    user: any,
    me: any,
    refetch: Function,
}) {
    const { user, me, refetch } = props;
    const queryClient = useQueryClient();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { mutate: blockMutate, isLoading: blockLoading } = useMutation(() => agent.app.bsky.graph.block.create({
        repo: me.did
    }, {
        subject: user.did,
        createdAt: new Date().toISOString()
    }),{
        onSuccess: d =>{
            queryClient.invalidateQueries(["user", user.did]);
            refetch();
        }
    });

    const _handleDropdown = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setDropdownOpen(prev => !prev);
    }

    const _handleBlock = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        blockMutate();
    }

    return (
        <>
        <div className={styles.more}>
            <button title="" type="button" onClick={_handleDropdown}>
                <img src={MoreIcon} alt='' />
            </button>
            {dropdownOpen ? <div className={styles.moreDropdown}>
                <p className="font-weight-bold" onClick={_handleBlock}>
                    {blockLoading ? <Loading isColored /> : <img src={BlockIcon} alt="" />}
                    <span>Block</span>
                </p>
            </div> : ''}
        </div>
        {dropdownOpen ? <Portal>
            <div className={styles.moreBackdrop} onClick={() => setDropdownOpen(prev => !prev)}></div>
        </Portal> : ''}
        </>
    );
}