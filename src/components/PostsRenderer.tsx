import { FeedViewPost } from "atproto/packages/api/src/client/types/app/bsky/feed/defs";
import React from "react";
import Blue from "./Blue/Blue";
import Loading from "./Loading";

export default function PostsRenderer(props: {
    isLoading?: boolean,
    feed?: any,
}) {
    const { isLoading, feed } = props;

    const _sortPosts: any | FeedViewPost = () => {
        // @ts-ignore
        return feed?.reduce((p1, p2) => {
            // @ts-ignore
            const postExists = p1.find(i => i.post.cid == p2.post.cid 
                || i.post.cid == p2.reply?.parent.cid 
                || i.reply?.root.cid == p2.reply?.root.cid 
                // || ((p2 as FeedViewPost).reply && (p2 as FeedViewPost).post.likeCount <= 1)
                );
            if (postExists) {
                return [...p1];
            }
            return [...p1, p2];
        }, [])
    }

    return (
        isLoading || !feed ? <div className='d-flex align-items-center justify-content-center p-5'><Loading isColored /></div> :
            feed ? _sortPosts().map((post: FeedViewPost, index: number) => {
                if (!!post.reply) {
                    return <React.Fragment key={index}>
                        {post.reply.parent.cid != post.reply.root.cid ? <Blue key={post.reply.root.cid} post={post.reply.root} isParent={true} /> : ''}
                        <Blue post={post.reply.parent} key={post.reply.parent.cid} isReply={true} isParent={true} />
                        <Blue post={post.post} key={post.post.cid} isReply={true} />
                    </React.Fragment>
                }
                return <Blue key={post.post.cid} post={post.post} isReply={!!post.reply} />
            }
            ) : ''
    );
}