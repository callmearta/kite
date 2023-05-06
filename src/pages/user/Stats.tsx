import { useState } from 'react';
import { Portal } from 'react-portal';
import { useInfiniteQuery, useQuery } from 'react-query';
import agent from '../../Agent';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import User from '../../components/Right/User';
import styles from './User.module.scss';

export default function Stats(props: {
    user: any
}) {
    const { user } = props;
    const [modal, setModal] = useState<{
        show: boolean,
        type: string | null
    }>({
        show: false,
        type: null
    });
    const { data: followersData, isLoading: followersLoading, fetchNextPage: followersFetchNextPage, hasNextPage: followersHasNextPage, isFetchingNextPage: followersNextPageLoading } = useInfiniteQuery(["followers", user.did], ({ pageParam }) => _fetchFollowers(pageParam), {
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.cursor ?? undefined;
        }
    });
    const { data: followingsData, isLoading: followingsLoading, fetchNextPage: followingsFetchNextPage, hasNextPage: followingsHasNextPage, isFetchingNextPage: followingsNextPageLoading } = useInfiniteQuery(["followings", user.did], ({ pageParam }) => _fetchFollowings(pageParam), {
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.cursor ?? undefined;
        }
    });

    const _fetchFollowers = async (pageParam: any) => {
        const result = await agent.getFollowers({
            actor: user.did,
            cursor: pageParam
        });
        return result;
    };

    const _fetchFollowings = async (pageParam: any) => {
        const result = await agent.getFollows({
            actor: user.did,
            cursor: pageParam
        });
        return result;
    };

    const _handleFollowersModal = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setModal({ show: true, type: 'followers' });
    };
    const _handleFollowingsModal = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setModal({ show: true, type: 'followings' });
    };

    const _fetchFollowersNextPage = async () => {
        if (followersHasNextPage && !followersNextPageLoading) return await followersFetchNextPage();
    };

    const _fetchFollowingsNextPage = async () => {
        if (followingsHasNextPage && !followingsNextPageLoading) return await followingsFetchNextPage();
    };

    return (
        <>
            <div className={styles.followStats}>
                <p className='pointer' onClick={_handleFollowersModal}>
                    <strong>{user?.followersCount}</strong>
                    <span>Followers</span>
                </p>
                <p className='pointer' onClick={_handleFollowingsModal}>
                    <strong>{user?.followsCount}</strong>
                    <span>Followings</span>
                </p>
                <p>
                    <strong>{user?.postsCount}</strong>
                    <span>Posts</span>
                </p>
            </div>
            {modal.show ? <Portal>
                <Modal onScrollEnd={() => modal.type == 'followers' ? _fetchFollowersNextPage() : _fetchFollowingsNextPage()} className="follows-modal" onClose={() => setModal({ show: false, type: null })}>
                    <h1>{{ followers: "Followers", followings: "Followings" }[modal.type!]}</h1>
                    {modal.type == 'followings' ?
                        <>
                            {followingsLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : followingsData?.pages.map(page => page.data.follows).flat().map(user => <User key={user.did} user={user} />)}
                        </>
                        :
                        <>
                            {followersLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : followersData?.pages.map(page => page.data.followers).flat().map(user => <User key={user.did} user={user} />)}
                        </>
                    }
                </Modal>
            </Portal> : ''}
        </>
    );
}