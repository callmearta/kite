import { encode } from 'cbor-x';
import cn from 'classnames';
import Compressor from 'compressorjs';
import { compress, compressAccurately, filetoDataURL } from 'image-conversion';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import agent from '../../../Agent';
import Loading from '../../../components/Loading';
import { userAtom } from '../../../store/user';
import styles from './Fleet.module.scss';

export default function New(props: {}) {
    const user = useAtomValue(userAtom);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    function convertDataURIToUint8Array(uri: string): Uint8Array {
        var raw = window.atob(uri.substring(uri.indexOf(';base64,') + 8))
        var binary = new Uint8Array(new ArrayBuffer(raw.length))
        for (let i = 0; i < raw.length; i++) {
            binary[i] = raw.charCodeAt(i)
        }
        return binary
    }

    async function blobToBase64(blob: Blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }


    const _handleChange = async (e: any) => {
        const file: File = e.target.files[0];
        // if (file.size / 1024 > 900) {
        //     toast("File is too large! Maximum size is 900kb");
        //     return;
        // }
        // if(file.size / 1024 < 100){
        //     toast("File is too small! Minimum size is 100kb");
        //     return;
        // }

        setLoading(true);

        const compressedImage = await compressImage(file);
        const compressImageString = await filetoDataURL(compressedImage as Blob);

        // @ts-ignore
        const uploadResult = await agent.uploadBlob(compressedImage, {
            encoding: 'image/jpeg'
        });

        try {
            const createResult = await agent.api.com.atproto.repo.createRecord({
                repo: user?.handle!,
                collection: "app.bsky.actor.profile",
                record: {
                    kiteType: 'fleet',
                    avatar: uploadResult.data.blob,
                    // kiteImageString: compressImageString,
                    // kiteImageUrl: postImageUrl,
                    createdAt: new Date().toISOString()
                }
            });
            if (createResult.success) {
                toast("Fleet uploaded!");
            }
        }
        catch (error) {
            console.error(error);
            toast('Image size is too big!');
            return setLoading(false);
        }

        queryClient.invalidateQueries("fleets");
        setLoading(false);
    };

    const compressImage = (file: File) => (new Promise((resolve, reject) => {
        const c = new Compressor(file, {
            // quality: .65,
            quality: .85,
            height: 1500,
            success: blob => resolve(blob),
            error: err => reject(err)
        })
    }));

    return (
        <div className={cn(styles.fleet, styles.new)}>
            {loading ? <Loading isColored /> : <strong>+</strong>}
            <input title="Upload New Fleet" type="file" accept='image/jpeg,image/png' onChange={_handleChange} />
        </div>
    );
}