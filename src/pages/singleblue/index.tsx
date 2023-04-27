import { FeedViewPost, NotFoundPost, ReplyRef, ThreadViewPost } from "atproto/packages/api/src/client/types/app/bsky/feed/defs";
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
        return data;
    };
    const { data, isLoading } = useQuery(["singlepost", cid, repo], () => _fetch({}), {
        onSuccess: d => {
            if(!parents.length){
                _generateParents(d.data.thread);
            }
        }
    });
    const post: ThreadViewPost | any = data?.data?.thread;

    const [parents,setParents] = useState<React.ReactNode[]>([]);
    const _generateParents = (p: any) => {
        parentsInitRef.current = true;
        if(p.parent){
            _generateParents(p.parent);
        }
        setParents(prev => ([...prev, <Blue isParent={true} key={prev.length + 1} post={p.post} />]));
    };

    return (
        <Layout className="single" backButton>
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