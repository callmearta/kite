import cn from 'classnames';
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
      

    const _handleChange = async (e: any) => {
        const file: File = e.target.files[0];
        if (file.size / 1024 > 900) {
            toast("File is too large! Maximum size is 900kb");
            return;
        }
        // if(file.size / 1024 < 100){
        //     toast("File is too small! Minimum size is 100kb");
        //     return;
        // }

        setLoading(true);
        // @ts-ignore
        const uploadResult = await agent.uploadBlob(await file.arrayBuffer(), {
            encoding: 'image/jpeg'
        });

        // const postResult = await agent.api.app.bsky.feed.post.create({
        //     repo: agent.session?.did
        // }, {
        //     createdAt: new Date().toISOString(),
        //     text: '',
        //     $type: 'app.bsky.feed.post',
        //     embed: {
        //         $type: "app.bsky.embed.images",
        //         images: [({ alt: "", image: uploadResult.data.blob.original })]
        //     }
        // });

        // const uploadedPost = await agent.getPostThread({
        //     uri: postResult.uri
        // })
        // // @ts-ignore
        // const postImageUrl = uploadedPost.data.thread.post?.embed.images[0].fullsize;
        // if (!postImageUrl) {
        //     return toast("Error Happened!");
        // }

        const createResult = await agent.api.com.atproto.repo.createRecord({
            repo: user?.handle!,
            collection: "app.bsky.actor.profile",
            record: {
                kiteType: 'fleet',
                avatar: uploadResult.data.blob,
                // kiteImageUrl: postImageUrl,
                createdAt: new Date().toISOString()
            }
        });

        // const deleteCreatedPost = await agent.deletePost(postResult.uri);
        queryClient.invalidateQueries("fleets");
        setLoading(false);
    };

    return (
        <div className={cn(styles.fleet, styles.new)}>
            {loading ? <Loading isColored /> : <strong>+</strong>}
            <input title="Upload New Fleet" type="file" accept='image/jpeg,image/png' onChange={_handleChange} />
        </div>
    );
}