import { CarReader } from "@ipld/car";
import { decode, decodeMultiple } from "cbor-x";
import { useAtomValue } from "jotai";
import { useInfiniteQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Loading from "../../components/Loading";
import { userAtom } from "../../store/user";

export default function Media(props: {}) {
    const params = useParams();
    const { did } = params;
    const user = useAtomValue(userAtom);
    const { data, isLoading, hasNextPage } = useInfiniteQuery(["media", did], ({ pageParam }) => _fetchMedia(pageParam));

    const _fetchMedia = async (pageParam: any) => {
        
        
        // const d = await agent.com.atproto.sync.getBlob({
        //     cid:result.data.cids[0],
        //     did: user?.did!
        // })
        // console.log(d);
        // const result = await agent.com.atproto.repo.listRecords({
        //     collection: 'app.bsky.embed.images#view',
        //     repo: did!,
        //     cursor: pageParam
        // });
        
        // return result;
    };

    return (
        isLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
            <>
                <div className="blocks-page">
                    {data?.pages.length ? data.pages.map(i => <div></div>) :
                        <p className="text-center p-5 text-grey">There are no blocked users!</p>
                    }
                </div>
                {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''}
            </>
    );
}