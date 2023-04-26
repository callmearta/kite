import { FeedViewPost, NotFoundPost, ReplyRef, ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Blue from "../../components/Blue/Blue";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";

export default function SingleBlue(props: {}) {
    const params = useParams();
    const { repo, cid } = params;
    const parentsInitRef = useRef<any>(false);

    const _fetch = async ({ uri }: { uri?: any }) => {
        const data = await agent.getPostThread({ uri: uri || `at://${repo}/app.bsky.feed.post/${cid}` });
        // setPost({ data: data.data.thread, loading: false });
        return data;
    };
    const { data, isLoading } = useQuery(["singlepost", cid, repo], () => _fetch({}), {
        onSuccess: d => {
            if(!parents.length){
                _generateParents(d.data.thread);
                // _generateParents(d.data.thread);
            }
        }
    });
    const post: ThreadViewPost | any = data?.data?.thread;
    // const { data: rootData, isLoading: rootLoading } = useQuery(["singlepost", post?.post.uri], () => _fetch({ uri: (data?.data.thread.post as any).record.reply.root.uri }), {
    //     enabled: post && !isLoading && !!(data?.data.thread.post as any).record.reply?.root.uri
    // });
    // const rootPosts: ThreadViewPost | any = rootData?.data?.thread;

    const [parents,setParents] = useState<React.ReactNode[]>([]);
    const _generateParents = (p: any) => {
        // if(p?.cid == post?.post?.cid && parentsInitRef.current) _generateParents(p.parent);;
        parentsInitRef.current = true;
        if(p.parent){
            console.log('gen2');
            _generateParents(p.parent);
        }
        setParents(prev => ([...prev, <Blue isParent={true} key={prev.length + 1} post={p.post} />]));
    };

    return (
        <Layout backButton>
            {/* {!!data?.data.thread.post.record.reply?.root.uri ? rootLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : <>
                <Blue isSingle={true} post={rootPosts?.post} />
                {rootPosts?.replies.map((p: any, index: number) => <Blue key={index} post={p.post} />)}
            </>
            :''} */}
            {isLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : <>
                {post.parent ? (
                    parents.length ? parents.slice(0,parents.length - 1) : <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div>
                    ) : ''}
                <Blue isSingle={true} post={post?.post} />
                {post?.replies.map((p: any, index: number) => <Blue key={index} post={p.post} />)}
            </>
            }
        </Layout>
    );
}