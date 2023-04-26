import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import cn from 'classnames';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { SyntheticEvent, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Portal } from 'react-portal';
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import AvatarPlaceholder from '../../assets/placeholder.png';
import BackButton from "../../components/BackButton";
import Blue from '../../components/Blue/Blue';
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import Lightbox from '../../components/Lightbox';
import Loading from "../../components/Loading";
import PostsRenderer from '../../components/PostsRenderer';
import { lightboxAtom } from '../../store/lightbox';
import { userAtom } from '../../store/user';
import renderMarkdown from "../../utils/renderMarkdown";
import styles from './User.module.scss';

export default function User(props: {}) {
    const params = useParams();
    const { did } = params;
    const me = useAtomValue(userAtom);
    const [lightbox, setLightbox] = useAtom<any>(lightboxAtom);
    const { data, isLoading } = useQuery(["user", did], () => agent.getProfile({
        actor: did!
    }), {
        onSuccess: d => {
            setUser(d.data);
        },
        onError: error => {
            console.error(error);
        }
    });
    const [user, setUser] = useState<ProfileViewDetailed | any>(data?.data! || null);
    const { data: postsData, isLoading: postsLoading } = useQuery(["userPosts", did], () => agent.getAuthorFeed({
        actor: did!
    }));

    const { mutate: followMutate, isLoading: followLoading } = useMutation(() => agent.follow(user?.did!), {
        onSuccess: d => {
            setUser((prev: any) => ({ ...prev, viewer: { ...prev?.viewer, following: d.uri } }));
        }
    });
    const { mutate: unfollowMutate, isLoading: unfollowLoading } = useMutation(() => agent.deleteFollow(user?.viewer?.following!), {
        onSuccess: d => {
            setUser((prev: any) => ({ ...prev, viewer: { ...prev?.viewer, following: false } }));
        }
    });

    const _handleFollow = (e: SyntheticEvent) => {
        e.preventDefault();

        followMutate(user?.did!);
    };

    const _handleUnfollow = (e: SyntheticEvent) => {
        e.preventDefault();

        unfollowMutate(user?.did!);
    }

    useEffect(() => {
        return () => {
            setUser(null);
        }
    }, []);

    

    return (
        <>
            <Layout key={user?.did}>
                <div className="back-button-wrapper">
                    <BackButton />
                </div>
                {isLoading || !user ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                    <>
                        <div className={styles.header}>
                            {user.banner ? <div className={styles.cover} onClick={() =>
                                // @ts-ignore
                                setLightbox(() => ({ show: true, images: [user.banner] }))}>
                                <img src={user?.banner} />
                            </div> : ''}
                            <div className={cn(styles.info, { [styles.noCover]: !user?.banner })}>
                                <div className={styles.avatar} onClick={() =>
                                    // @ts-ignore
                                    setLightbox(() => ({ show: true, images: [user?.avatar] }))}>
                                    <img src={user?.avatar || AvatarPlaceholder} alt={user?.displayName} />
                                </div>
                                {user.did == me?.did ? '' : <div className={styles.infoRight}>
                                    {user?.viewer?.following ? <Button className="btn" text="Unfollow" loading={unfollowLoading} loadingColored onClick={_handleUnfollow} /> : <Button className="btn primary" text="Follow" loading={followLoading} onClick={_handleFollow} />}
                                </div>}
                            </div>
                            <div>
                                <div className={cn("d-flex align-items-center", styles.nameWrapper)}>
                                    <h1>{user?.displayName}</h1>
                                    {user?.viewer?.followedBy ? <span className="tag">Follows You</span> : ''}
                                </div>
                                <span className="text-grey">@{user?.handle}</span>
                                <p dir="auto"><ReactMarkdown>{renderMarkdown(user?.description.replace(/\n/g,' \\\n '))}</ReactMarkdown></p>
                                <div className={styles.followStats}>
                                    <p>
                                        <strong>{user?.followersCount}</strong>
                                        <span>Followers</span>
                                    </p>
                                    <p>
                                        <strong>{user?.followsCount}</strong>
                                        <span>Followings</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.tabs}>
                            <a href="#" title="" target="_self" className={cn(styles.tab, { [styles.active]: true })}>Posts</a>
                            {/* <a href="#" title="" target="_self" className={styles.tab}>Posts & Replies</a> */}
                        </div>
                        <div className={styles.posts}>
                            {postsLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                                <>
                                    <PostsRenderer isLoading={isLoading} feed={postsData?.data.feed} />
                                </>
                            }
                        </div>
                    </>
                }
            </Layout>
            {lightbox.show ? <Portal>
                <Lightbox />
            </Portal> : ''}
        </>
    );
}