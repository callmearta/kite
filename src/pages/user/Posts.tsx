import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Loading from "../../components/Loading";
import PostsRenderer from "../../components/PostsRenderer";

export default function Posts(props: {}) {
    const params = useParams();
    const { did } = params;
    const [posts, setPosts] = useState<any[]>([]);
    const { data: postsData, isLoading: postsLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(["userPosts", did], ({ pageParam }) => {
        return agent.getAuthorFeed({
            actor: did!,
            cursor: pageParam || undefined
        })
    }, {
        retryOnMount: true,
        onSuccess: d => {
            setPosts(d.pages.map(p => p.data.feed).flat());
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.data?.cursor ? lastPage.data.cursor : undefined;
        }
    });

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
        postsLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
            <>
                <PostsRenderer isLoading={postsLoading} feed={posts} />
                {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
            </>

    );
}