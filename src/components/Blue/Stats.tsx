import { useEffect, useState } from 'react';
import { Portal } from 'react-portal';
import { useInfiniteQuery, useQuery } from 'react-query';
import agent from '../../Agent';
import Loading from '../Loading';
import Modal from '../Modal';
import User from '../Right/User';
import styles from './Blue.module.scss';

export default function Stats(props: {
    post: any
}) {
    const { post } = props;
    const [modal, setModal] = useState<any>({
        show: false,
        type: null,
        loading: false
    });
    const { data: repostData, isLoading: repostLoading, fetchNextPage: repostFetchNextPage, hasNextPage: repostHasNextPage, isFetchingNextPage: repostFetchingNextPage } = useInfiniteQuery(["reposts", post.uri], ({ pageParam }) => _fetchReposts(pageParam), {
        enabled: modal.show && modal.type == 'repost',
        getNextPageParam: (lastPage,allPages) => {
            return lastPage.data.cursor ?? undefined;
        }
    });

    const _fetchReposts = async (pageParam: any) => {
        const result = await agent.getRepostedBy({
            uri: post.uri,
            cursor: pageParam
        });
        return result;
    };
    const { data: likesData, isLoading: likesLoading, fetchNextPage: likesFetchNextPage, hasNextPage: likesHasNextPage,isFetchingNextPage: likesFetchingNextPage } = useInfiniteQuery(["likes", post.uri], ({ pageParam }) => _fetchLikes(pageParam), {
        enabled: modal.show && modal.type == 'likes',
        getNextPageParam: (lastPage,allPages) => {
            return lastPage.data.cursor ?? undefined;
        }
    });
    
    const _fetchLikes = async (pageParam: any) => {
        const result = await agent.getLikes({
            uri: post.uri,
            cursor: pageParam
        });
        return result;
    };

    const _handleReposts = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setModal({ show: true, type: 'repost', loading: true });
    }

    const _handleLikes = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setModal({ show: true, type: 'likes', loading: true });
    }

    const _handleRepostNextPage = async () => {
        if (repostHasNextPage && !repostFetchingNextPage) return await repostFetchNextPage();
    }

    const _handleLikeNextPage = async () => {
        if (likesHasNextPage && !likesFetchingNextPage) return await likesFetchNextPage()
    }

    return (
        <>
            <div className={styles.stats}>
                <div onClick={_handleLikes}>{post.likeCount} Likes</div>
                <div onClick={_handleReposts}>{post.repostCount} Reposts</div>
            </div>
            {modal.show ? <Portal>
                <Modal onScrollEnd={() => modal.type == 'repost' ? _handleRepostNextPage() : _handleLikeNextPage()} className='repost-modal' onClose={() => setModal({ show: false, type: null })}>
                    <h1>{modal.type == 'repost' ? 'Reposts' : 'Likes'}</h1>
                    {
                        modal.type == 'repost' ? repostLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                            repostData?.pages.map(page => page.data.repostedBy).flat().map((user: any) => <User key={user.did} user={user} />)
                            :
                            likesLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                                likesData?.pages.map(page => page.data.likes).flat().map((user: any) => <User key={user.did} user={user.actor} />)
                    }
                </Modal>
            </Portal> : ''}
        </>
    );
}