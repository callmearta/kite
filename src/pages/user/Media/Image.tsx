import { useSetAtom } from "jotai";
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import agent from "../../../Agent";
import Loading from "../../../components/Loading";
import { lightboxAtom } from "../../../store/lightbox";
import useOnScreen from "../../../utils/useOnScreen";

export default function Image(props: {
    cid: string,
    user: any
}) {
    const { cid, user } = props;
    const [imageUrl, setImageUrl] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref)
    const { data, isLoading } = useQuery(["getBlob", cid, user.did], () => _fetchImage(), {
        enabled: isVisible,
        refetchOnMount:false,
        refetchOnWindowFocus: false,
        cacheTime: Infinity,
        staleTime: Infinity
    });
    const _fetchImage = async () => {
        const blobData = await agent.com.atproto.sync.getBlob({
            cid: cid,
            did: user?.did!
        })
        const arrayBufferView = new Uint8Array(blobData.data!);
        const blob = new Blob([arrayBufferView]);
        const url = URL.createObjectURL(blob);

        return url;
    };
    const setLightbox = useSetAtom(lightboxAtom);

    const _handleImageClick = (e: SyntheticEvent) => {
        if (isLoading) return;
        e.preventDefault();
        e.stopPropagation();

        setLightbox({ images: [data], show: true, isFleet: false, meta: null });
    };

    return (
        <div ref={ref} className="media pointer" onClick={_handleImageClick}>
            {!isLoading ? <img src={data!} alt="" /> : <Loading isColored />}
        </div>
    );
}