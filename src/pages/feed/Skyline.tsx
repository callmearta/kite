import { AppBskyFeedGetTimeline } from '@atproto/api';
// @ts-ignore
import { FeedViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import cn from 'classnames';
import { useAtom, useAtomValue } from 'jotai';
import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import agent from '../../Agent';
import ArrowIcon from '../../assets/back.svg';
import FirehoseIcon from '../../assets/firehose.svg';
import HotIcon from '../../assets/hot.png';
import KiteIcon from '../../assets/kite.png';
import Loading from '../../components/Loading';
import PostsRenderer from '../../components/PostsRenderer';
import Right from '../../components/Right';
import { UI_STORAGE_KEY, uiAtom } from '../../store/ui';
import { userAtom } from '../../store/user';
import styles from './Feed.module.scss';
import Fleets from './Fleet';
import New from './New';

export default function Skyline(props: {}) {
    const user = useAtomValue(userAtom);
    const page = useRef<any>(null);
    const refetchRef = useRef<any>(null);
    const [newPosts, setNewPosts] = useState<Array<any>>([]);
    const [ui, setUi] = useAtom(uiAtom);
    const headerRef = useRef<any>(null);
    const lastScrollPost = useRef<any>(null);

    const _fetchFeed = async (pageParam: any) => {
        // if(pageParam)
        //     page.current= (pageParam || null);
        const feed: AppBskyFeedGetTimeline.Response = await agent.getTimeline({
            algorithm: "reverse-chronological",
            cursor: pageParam
        });
        if (pageParam)
            page.current = feed.data.cursor;
        return feed;
    }
    const { data, isLoading, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(["skyline"], ({ pageParam }) => _fetchFeed(pageParam), {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: Infinity,
        onSuccess: d => {
            const lastPage = d.pages[d.pages.length - 1];
            if (
                !feed.length
                || (page.current && page.current != d.pages[d.pages.length - 1].data.cursor)

                // If we have feed data and our first post is same as fetched data's first page's first post it means there's no new data and also the data is not coming from pagination
                // and also we check our last page's last post with fetched data's last page's last post to check if this data is from pagination and if so we append it to the feed
                || (feed.length && feed[0].post.uri == d.pages[0].data.feed[0].post.uri && feed[feed.length - 1].post.uri != lastPage.data.feed[lastPage.data.feed.length - 1].post.uri)
            ) {

                setFeed([...feed, ...d.pages[d.pages.length - 1].data.feed]);
            } else {
                _handleNewPosts(d.pages[0].data.feed)
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.cursor ? lastPage.data.cursor : undefined;
        }
    });

    const [feed, setFeed] = useState<any>(data?.pages[0]?.data.feed || []);

    const _handleNewPosts = useCallback((data: FeedViewPost[]) => {
        const samePost = data[0].post.uri == feed[0].post.uri;

        if (!samePost) {
            setNewPosts(data);
        }
        _updatePosts(data);
    }, [feed]);

    const _updatePosts = (data: FeedViewPost[]) => {
        let newFeed = [...feed];
        for (let i = 0; i < data.length; i++) {
            const post = data[i];
            const postInFeedIndex = newFeed.findIndex(p => p.post.uri == post.post.uri);
            if (postInFeedIndex > -1) {
                if (post.post)
                    newFeed[postInFeedIndex].post = post.post;

                if (post.reply)
                    newFeed[postInFeedIndex].reply = post.reply;

                if (post.reason)
                    newFeed[postInFeedIndex].reason = post.reason;
            }
        }
        setFeed([...newFeed]);
    };

    const _handleRefetch = () => {
        refetchRef.current = setTimeout(() => {
            refetch({ refetchPage: (page, index) => index === 0 });
            _handleRefetch();
        }, 5000);
    };

    useEffect(() => {
        _handleRefetch();

        return () => {
            clearTimeout(refetchRef.current);
        };
    }, []);

    useEffect(() => {
        let fetching = false;
        const handleScroll = async (e: any) => {
            const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;
            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true
                if (hasNextPage) await fetchNextPage()
                fetching = false
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [fetchNextPage, hasNextPage])

    const _handleNewPostsClick = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const currentNewPosts = [...newPosts];
        setFeed(currentNewPosts);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
        setNewPosts([]);
    };

    useEffect(() => {
        // const ws = new WebSocket("wss://bsky.social/xrpc/com.atproto.sync.subscribeRepos");
    }, []);

    const _handleHot = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setUi(prev => ({ ...prev, hot: true }));
        localStorage.setItem(UI_STORAGE_KEY, JSON.stringify({ ...ui, hot: true }));
    };

    const _handleFirehose = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setUi(prev => ({ ...prev, firehose: true }));
        localStorage.setItem(UI_STORAGE_KEY, JSON.stringify({ ...ui, firehose: true }));
    };

    const _scrollToTop = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }

    const _handleSticky = (e: any) => {
        if (lastScrollPost.current && document.documentElement.scrollTop > headerRef.current.nextSibling.clientHeight) {
            const diff = lastScrollPost.current - document.documentElement.scrollTop;
            if (diff >= 0) {
                headerRef.current.animate({
                    transform: "translateY(0)"
                }, {
                    duration: 750,
                    ease: "easeOut",
                    fill: "forwards"
                });
            } else {
                headerRef.current.animate({
                    transform: `translateY(-${headerRef.current.clientHeight}px)`
                }, {
                    duration: 750,
                    ease: "easeOut",
                    fill: "forwards"
                });
            }
        }
        lastScrollPost.current = document.documentElement.scrollTop;
    }

    useEffect(() => {
        if (window.innerWidth < 1024) {
            document.addEventListener("scroll", _handleSticky);
        }

        return () => {
            document.removeEventListener("scroll", _handleSticky);
        };
    }, [window.innerWidth]);

    return (
        <div className="skyline">
            <Fleets />
            {newPosts.length ? <button onClick={_handleNewPostsClick} className={cn("btn primary", styles.newPosts)}>
                <div className={styles.newAvatars}>
                    {newPosts.filter((i, index) => i.post && i.post.author && newPosts.findIndex(p => p.post?.author.did == i.post?.author.did) == index).slice(0, 3).map(post =>
                        <div className={styles.newAvatar} key={post?.post?.author.did}>
                            <img src={post.post?.author?.avatar} alt="" />
                        </div>
                    )}
                </div>
                <strong>
                    New Posts
                </strong>
                <img src={ArrowIcon} alt="" />
            </button> : ''}
            <div className="col-header" ref={headerRef}>
                {window.innerWidth < 1024 ?
                    <>
                        <img src={KiteIcon} height={32} alt="" />
                        <h1 onClick={_scrollToTop}>Kite</h1>
                    </> : <h1>Skyline</h1>}
                <div>
                    {!ui.hot ?
                        <button className="header-btn" onClick={_handleHot}>
                            <span>Hot</span><img src={HotIcon} alt="Hot Column" />
                        </button> : ''}
                    {!ui.firehose ?
                        <button className="header-btn" onClick={_handleFirehose}>
                            <span>RealTime</span><img src={FirehoseIcon} alt="Firehose Column" />
                        </button> : ''}
                </div>
            </div>
            <New />
            {isLoading || feed.length ? <PostsRenderer isLoading={isLoading} feed={feed} /> :
                <div>
                    {/* <img src={} alt="" /> */}
                    <p className="d-flex align-items-center justify-content-center p-5 text-grey text-center">Nothing to see here!<br />Get in there and follow some people!</p>
                    {!user?.followsCount ? <div>
                        <Right isInSkyline />
                    </div> : ''}
                </div>
            }
            {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
        </div>
    );
}