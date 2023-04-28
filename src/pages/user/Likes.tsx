import { Record } from "atproto/packages/api/src/client/types/com/atproto/repo/listRecords";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Loading from "../../components/Loading";
import PostsRenderer from "../../components/PostsRenderer";

export default function Likes(props: {}) {
    const params = useParams();
    const { did } = params;
    const { data, isLoading: postsLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(["userLikes", did], ({ pageParam }) => {
        return agent.api.com.atproto.repo.listRecords({
            collection: "app.bsky.feed.like",
            repo: did!,
            cursor: pageParam || undefined,
            limit: 25
        })
    }, {
        retryOnMount: true,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.cursor ? lastPage.data.cursor : undefined;
        },
        onSuccess: async d => {
            const result = await agent.api.app.bsky.feed.getPosts({
                uris: d.pages[d.pages.length - 1].data.records.map(record => (record.value as any).subject.uri)
            });
            let newPosts = d ? [...d?.pages[d.pages.length - 1].data.records!] : [];
            for (let i = 0; i < result.data.posts.length; i++) {
                const post = result.data.posts[i];
                const indexInPostsData = newPosts.findIndex(i => (i.value as any).subject.uri == post.uri);
                if (indexInPostsData > -1) {
                    newPosts[indexInPostsData].post = post;
                }
            }
            newPosts = newPosts.filter(p => p.post);
            setPostsData([...postsData, ...newPosts]);
        }
    });
    const [postsData, setPostsData] = useState<Record[]>([]);

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

    return (
        postsLoading || !postsData.length ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
            <>
                <PostsRenderer isLoading={postsLoading} feed={postsData} />
                {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
            </>

    );
}