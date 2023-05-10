import { CarReader } from "@ipld/car";
import { decode, decodeMultiple } from "cbor-x";
import { useAtomValue, useSetAtom } from "jotai";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import agent from "../../Agent";
import Loading from "../../components/Loading";
import { lightboxAtom } from "../../store/lightbox";
import { userAtom } from "../../store/user";
import Image from "./Media/Image";

export default function Media(props: {
    user: any
}) {
    const { user } = props;
    const params = useParams();
    const setLightbox = useSetAtom(lightboxAtom);
    const { did } = params;
    const [reachedEnd, setReachedEnd] = useState(false);
    const { data, isLoading } = useQuery(["listBlobs", did], () => _fetchBlobList(), {
        cacheTime: Infinity,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
    // const { data: mediaData, isLoading: mediaLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(["media", did], ({ pageParam }) => _fetchMedia(pageParam, 10), {
    //     cacheTime: Infinity,
    //     refetchOnWindowFocus: false,
    //     enabled: !!data?.length && !isLoading,
    //     getNextPageParam: (lastPage, allPages) => {
    //         return lastPage?.cursor ?? undefined;
    //     }
    // });

    const _fetchBlobList = async () => {
        const blobs = await agent.com.atproto.sync.listBlobs({
            did: user?.did!,
        });
        return blobs.data.cids;
    };

    // const _fetchMedia = async (pageParam: any, limit: number) => {
    //     let images: string[] = [];
    //     const blobs = data;

    //     if (!blobs?.length) return;
    //     const nextPageLimit = pageParam ? pageParam + limit : limit;
    //     console.log(nextPageLimit);
    //     const limitedArray = blobs.splice((pageParam ? pageParam : 0), nextPageLimit);

    //     await Promise.all(
    //         limitedArray.reverse().map(async (cid, index) => {
    //             const blobData = await agent.com.atproto.sync.getBlob({
    //                 cid: cid,
    //                 did: user?.did!
    //             })
    //             const arrayBufferView = new Uint8Array(blobData.data);
    //             const blob = new Blob([arrayBufferView]);
    //             const url = URL.createObjectURL(blob);
    //             images[index] = (url);
    //         })
    //     )

    //     return {
    //         data: images,
    //         cursor: ((pageParam || 0) + limit) <= (blobs.length || 0) ? (pageParam || 0) + limit : undefined
    //     };
    // };


    return (
        isLoading ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
            <>
                <div className="media-page">
                    {data?.length ?
                        <div className="medias">
                            {data.map((i, index) =>
                                <Image key={i} cid={i} user={user} />
                            )}
                        </div> :
                        <p className="text-center p-5 text-grey">There are no images!</p>
                    }
                </div>
                {/* {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''} */}
            </>
    );
}