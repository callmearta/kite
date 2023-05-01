import { FeedViewPost } from "atproto/packages/api/src/client/types/app/bsky/feed/defs";
import { useAtomValue } from "jotai";
import React from "react";
import { Link } from "react-router-dom";
import { settingsAtom } from "../store/settings";
import blacklist from "../utils/blacklist";
import linkFromPost from "../utils/linkFromPost";
import Blue from "./Blue/Blue";
import Loading from "./Loading";

export default function PostsRenderer(props: {
    isLoading?: boolean,
    feed?: any,
}) {
    const { isLoading, feed } = props;
    const settings = useAtomValue(settingsAtom);

    const _sortPosts: any | FeedViewPost = () => {
        
        // @ts-ignore
        return feed?.reduce((p1, p2: FeedViewPost) => {
            // @ts-ignore
            const postExists = p1.find(i => i.post.cid == p2.post.cid
                // || i.post.cid == p2.reply?.parent.cid
                // || i.reply?.root.cid == p2.reply?.root.cid
                || ((p2 as FeedViewPost).reply && (p2?.post as any).likeCount <= 1)
            );
            if (postExists) {
                return [...p1];
            }
            return [...p1, p2];
        }, []).filter((p:FeedViewPost) => blacklist(p, settings.blacklist))
    }

    return (
        isLoading || !feed ? <div className='d-flex align-items-center justify-content-center p-5'><Loading isColored /></div> :
            feed ? _sortPosts().filter((post:any) => !post?.blocked).map((post: FeedViewPost, index: number) => {
                if (!!post.reply) {
                    return <React.Fragment key={index}>
                        {post.reply.parent.cid != post.reply.root.cid ? <Blue key={post.reply.root.cid} post={post.reply.root} isParent={true} reason={post.reason} /> : ''}
                        {(post.reply.parent.record as any)?.reply?.parent.cid != (post.reply.parent.record as any)?.reply?.root.cid ? <p className="view-thread"><Link to={linkFromPost(post.reply.parent)} title="View Thread">+ View Thread</Link></p> : ''}
                        <Blue post={post.reply.parent} key={post.reply.parent.cid} isReply={true} isParent={true} reason={post.reason} />
                        <Blue post={post.post} key={post.post.cid} isReply={true} reason={post.reason} />
                    </React.Fragment>
                }
                return <Blue key={post?.post?.cid} post={post?.post} isReply={!!post.reply} reason={post.reason} />
            }
            ) : ''
    );
}