import { ipldToLex, jsonToLex } from '@atproto/lexicon';
import { CarReader } from '@ipld/car';
import { decode, decodeMultiple } from 'cbor-x';
import cn from 'classnames';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { CID } from 'multiformats';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import agent from '../../../Agent';
import Loading from '../../../components/Loading';
import { lightboxAtom } from '../../../store/lightbox';
import { userAtom } from '../../../store/user';
import styles from './Fleet.module.scss';

export default function Fleet(props: {
    record: {
        user: any,
        data: any[]
    }
}) {
    const { record } = props;
    const user = useAtomValue(userAtom);
    const [image, setImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const setLightbox = useSetAtom(lightboxAtom);

    const _fetchImages = async () => {
        setLoading(true);
        let newUrls: any = [];
        await Promise.all(
            record.data.map(async image => {
                if (!image.value.kiteType || image.value.kiteType != 'fleet') return;
                if (image.value.kiteImageUrl) {
                    newUrls.push({ url: image.value.kiteImageUrl, createdAt: image.value.createdAt });
                    return;
                }
                if (image.value.kiteImageString) {
                    newUrls.push({ url: image.value.kiteImageString, createdAt: image.value.createdAt });
                    return;
                }
                const cid = image.value.avatar?.ref.toString();
                if (!cid) return;
                const split = image.uri.split('/');
                try {
                    const result = await agent.com.atproto.sync.getBlob({
                        cid: cid,
                        did: split[2],
                    });
                    const arrayBufferView = new Uint8Array(result.data);
                    const blob = new Blob([arrayBufferView]);
                    const url = URL.createObjectURL(blob);
                    newUrls.push({ url: url, createdAt: image.value.createdAt });
                }
                catch (error) {
                    toast("Oops! Something is wrong with their fleet");
                }
            })
        )
        newUrls = newUrls.sort((a: any, b: any) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()).filter((image: any) => image.url);
        let meta = { ...record };
        meta.data = record.data.sort((a: any, b: any) => new Date(a.value.createdAt).valueOf() - new Date(b.value.createdAt).valueOf())
        setLoading(false);
        if (newUrls.length) {
            setImage(newUrls);
            setLightbox({
                images: newUrls.map((url: any) => url.url),
                show: true,
                isFleet: record.user.did == user?.did,
                meta: meta
            });
        }
    }

    return (
        <div className={cn(styles.fleet, { [styles.loading]: loading })} onClick={_fetchImages}>
            <img src={record.user.avatar} alt="" />
            {loading ? <Loading /> : ''}
        </div>
    );
}