import { FeedViewPost, NotFoundPost, ReplyRef, ThreadViewPost } from "@atproto/api/src/client/types/app/bsky/feed/defs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Blue from "../../components/Blue/Blue";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import blacklist from "../../utils/blacklist";

export default function SingleBlue(props: {}) {
    const params = useParams();
    const { repo, cid } = params;
    const parentsInitRef = useRef<any>(false);

    useEffect(() => {
        // return () => {
        //     setParents([]);
        // }
    },[]);

    const _fetch = async ({ uri }: { uri?: any }) => {
        if(repo?.startsWith('did')){
            const data = await agent.getPostThread({ uri: uri || `at://${repo}/app.bsky.feed.post/${cid}` });
            return data;
        }else{
            const did = await agent.resolveHandle({
                handle: repo
            });
            const data = await agent.getPostThread({ uri: uri || `at://${did.data.did}/app.bsky.feed.post/${cid}` });
            return data;
        }
    };
    const { data, isLoading } = useQuery(["singlepost", cid, repo], () => _fetch({}), {
        onSuccess: d => {
            if (!parents.length && !data?.data.thread.blocked) {
                _generateParents(d.data.thread);
            }
        }
    });
    const post: ThreadViewPost | any = data?.data?.thread;

    const [parents, setParents] = useState<React.ReactNode[]>([]);
    const _generateParents = useCallback((p: any) => {
        parentsInitRef.current = true;
        if (p.parent) {
            _generateParents(p.parent);
        }
        setParents(prev => ([...prev, <Blue isParent={true} key={prev.length + 1} post={p.post} />]));
    },[cid]);

    return (
        <Layout key={cid} className="single" backButton>
            {isLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                post.blocked ?
                    <p className="p-5 d-flex align-items-center justify-content-center">You've blocked this account</p>
                    : <>
                        {post.parent ? (
                            parents.length ? parents.slice(0, parents.length - 1) : <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div>
                        ) : ''}
                        <Blue key={post?.post.uri} isSingle={true} post={post?.post} />
                        {post?.replies.filter(blacklist).filter((p: any) => !p.blocked).map((p: any, index: number) => <Blue key={p.post.uri} post={p.post} />)}
                    </>
            }
        </Layout>
    );
}