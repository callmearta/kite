import { FeedViewPost } from "@atproto/api/src/client/types/app/bsky/feed/defs";
import { useAtomValue } from "jotai";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { settingsAtom } from "../store/settings";
import { userAtom } from "../store/user";
import blacklist from "../utils/blacklist";
import linkFromPost from "../utils/linkFromPost";
import Blue from "./Blue/Blue";
import Loading from "./Loading";

export default function PostsRenderer(props: {
    isLoading?: boolean,
    feed?: any,
    isProfile?: boolean,
    hideReplies?: boolean,
    onlyReplies?: boolean
}) {
    const { isLoading, feed, isProfile, hideReplies, onlyReplies } = props;
    const settings = useAtomValue(settingsAtom);
    const user = useAtomValue(userAtom);

    const _sortPosts: any | FeedViewPost = useCallback(() => {

        // @ts-ignore
        return feed?.reduce((p1, p2: FeedViewPost) => {
            // @ts-ignore
            const postExists = p1.find(i => i.post.cid == p2.post.cid
                // @ts-ignore
                // || i.post.cid == p2.reply?.root.cid
                // || i.post.cid == p2.reply?.parent.cid
                // || i.post?.record?.reply?.root?.cid == p2.post?.record?.reply?.root?.cid
                // || i.reply?.root.cid == p2.reply?.root.cid
                // || p1[p1.length - 1].post.author.did == p2.post.author.did
            );
            if (p2.reply && !p2.randomness) {
                p2.randomness = Math.random();
            }

            if (postExists
                // || (!isProfile && p2.post.author.did != user?.did && ((p2 as FeedViewPost).reply && (p2?.post as any).likeCount <= 1))
                // || (!isProfile && p2.post.author.did != user?.did && p2.reply && p2.reply.parent.cid != p2.reply.root.cid && p2.reply.parent.author.did != p2.reply.root.author.did && (p2.randomness as number) < .2)
                || (!isProfile && p2.post.author.did != user?.did && p2.reply && p2.reply.parent.cid == p2.reply.root.cid && p2.reply.parent.author.did == p2.reply.root.author.did)
                || (hideReplies && p2.reply)
                || (onlyReplies && !p2.reply)
            ) {
                return [...p1];
            }
            return [...p1, p2];
        }, [])
            .filter((p: FeedViewPost) => blacklist(p, settings.blacklist))
            .filter((value: any, index: number, self: any[]) =>
                index === self.findIndex(p =>
                    p.post.cid == value.post.cid
                    || p.reply?.root.cid == value.post.cid
                    || p.reply?.parent.cid == value.post.cid
                    || (p.reply?.root.cid == value.reply?.root.cid && p.reply?.parent.cid != value.reply?.parent.cid)
                )
            )
    }, [feed])

    return (
        isLoading || !feed ? <div className='d-flex align-items-center justify-content-center p-5'><Loading isColored /></div> :
            feed && feed.length ? _sortPosts().filter((post: any) => !post?.blocked).map((post: FeedViewPost, index: number) => {
                if (!!post.reply && !post.reason) {
                    return <React.Fragment key={index}>
                        {post.reply.parent.cid != post.reply.root.cid && post.reply.parent.author.did == post.reply.root.author.did ? <Blue key={post.reply.root.cid} post={post.reply.root} isParent={true} reason={post.reason} /> : ''}
                        {(post.reply.parent.record as any)?.reply?.parent.cid != (post.reply.parent.record as any)?.reply?.root.cid ? <p className="view-thread"><Link to={linkFromPost(post.reply.parent)} title="View Thread">+ View Thread</Link></p> : ''}
                        <Blue post={post.reply.parent} key={post.reply.parent.cid} isReply={true} isParent={true} reason={post.reason} />
                        <Blue post={post.post} key={post.post.cid} isReply={true} reason={post.reason} />
                    </React.Fragment>
                }
                return <Blue key={post?.post?.cid} post={post?.post} isReply={!!post.reply} reason={post.reason} />
            }
            ) : <p className="d-flex align-items-center justify-content-center p-5 text-grey">There are no posts here!</p>
    );
}