import { RichText } from '@atproto/api';
import { Record } from '@atproto/api/src/client/types/app/bsky/feed/post';
import cn from 'classnames';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import agent from '../../Agent';
import CloseIcon from '../../assets/close.svg';
import ImageIcon from '../../assets/image.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import Button from '../../components/Button';
import Composer from '../../components/Composer';
import styles from '../../components/NewModal/New.module.scss';
import { lightboxAtom } from '../../store/lightbox';
import { userAtom } from '../../store/user';

export default function New(props: {}) {
    const user: any = useAtomValue(userAtom);
    const queryClient = useQueryClient();
    const [text, setText] = useState('');
    const [lightbox, setLightbox] = useAtom(lightboxAtom);
    const { mutate, isLoading } = useMutation((d: Record) => agent.api.app.bsky.feed.post.create({ repo: agent.session?.did }, d), {
        onSuccess: d => {
            setText('');
            const event = new Event("publish-post");
            window.dispatchEvent(event);
            queryClient.invalidateQueries(["skyline"]);
        },
        onError: error => {
            console.error(error);
            toast("Something went wrong");
        }
    });

    const _handleSubmit = async (filesData: any[], text: string, audio: any = null) => {
        const filesUpload = filesData;
        const rt = new RichText({ text });
        await rt.detectFacets(agent);

        let data = {
            createdAt: new Date().toISOString(),
            text: rt.text,
            facets: rt.facets,
            $type: 'app.bsky.feed.post',
        }
        if (filesUpload.length) {
            // @ts-ignore
            data.embed = {
                $type: "app.bsky.embed.images",
                images: filesUpload.length ? filesUpload.map(i => ({ alt: "", image: i.data.blob.original })) : undefined
            }
        }
        if (audio) {
            // @ts-ignore
            data.kiteAudio = audio;
            const newRt = new RichText({ text: 'Unsupported audio message. To view this message you need to use Kite 🪁\n\nhttps://kite.black' });
            await newRt.detectFacets(agent);
            data.text = newRt.text;
            data.facets = newRt.facets;
            // @ts-ignore
            data.kiteText = rt.text || '\n';
        }

        mutate(data)
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.left}>
                <div className={styles.avatar}>
                    <img src={user?.avatar || AvatarPlaceholder} alt="" />
                </div>
            </div>
            <div className={styles.right}>
                <Composer onSubmit={_handleSubmit} submitLoading={isLoading} />
            </div>
        </div>
    );
}