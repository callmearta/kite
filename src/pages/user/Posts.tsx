import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Blue from "../../components/Blue/Blue";
import Loading from "../../components/Loading";
import PostsRenderer from "../../components/PostsRenderer";

export default function Posts(props: {
    user: any,
    hideReplies?: boolean,
    onlyReplies?: boolean
}) {
    const { user, hideReplies, onlyReplies } = props;

    const params = useParams();
    const { did } = params;
    const [blocked, setBlocked] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const { data: postsData, isLoading: postsLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(["userPosts", did], ({ pageParam }) => agent.getAuthorFeed({
        actor: did!,
        cursor: pageParam || undefined
    })
        , {
            onSuccess: d => {
                if (d.pages && d.pages.length && d.pages[0])
                    setPosts(d.pages.map(p => p?.data.feed).flat());
            },
            getNextPageParam: (lastPage, allPages) => {
                return lastPage?.data?.cursor ? lastPage.data.cursor : undefined;
            }
        });

    const [posts, setPosts] = useState<any[]>(postsData?.pages.map(p => p?.data.feed).flat() || []);

    const _fetchPinPost = async () => {
        try {
            const result = await agent.com.atproto.repo.getRecord({
                collection: 'app.bsky.actor.profile',
                repo: user.handle,
                rkey: 'self'
            })
            if ((result.data.value as any).kitePinPost) {
                const pinPost = await agent.getPostThread({
                    uri: (result.data.value as any).kitePinPost
                });
                setPinPost(pinPost.data.thread);
            } else {
                setPinPost(null);
            }
        }
        catch (error) {
            console.error(error);
            toast('Something went wrong');
        }
    };

    const { data: pinPostdata, isLoading: pinPostLoading } = useQuery(["pin-post", did], _fetchPinPost,{
        cacheTime: Infinity
    });

    const [pinPost, setPinPost] = useState<any>((pinPostdata as any)?.data?.thread || null);

    useEffect(() => {
        // if (document.documentElement.scrollHeight <= window.innerHeight) {
        //     setReachedEnd(true);
        //     return;
        // }
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

    return (
        postsLoading || pinPostLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
            <>
                {blocked ?
                    <p className="p-5 d-flex align-items-center justify-content-center">You've blocked this account</p>
                    : <>
                        {pinPost ? <Blue isPin post={pinPost.post} /> : ''}
                        <PostsRenderer onlyReplies={onlyReplies} hideReplies={hideReplies} isLoading={false} feed={posts} isProfile={true} />
                    </>}
                {hasNextPage && !reachedEnd ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
            </>

    );
}