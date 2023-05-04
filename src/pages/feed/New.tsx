import { RichText } from '@atproto/api';
import { Record } from '@atproto/api/src/client/types/app/bsky/feed/post';
import cn from 'classnames';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
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
        }
    });

    const _handleSubmit = async (filesData: any[], text: string) => {
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
                {/* <form onSubmit={_handleSubmit}>
                    <textarea style={{resize:'vertical'}} dir="auto" className={cn({ [styles.open]: text.length })} placeholder="What's on your mind?" onKeyDown={_handleCtrlEnter} onChange={e => setText(e.target.value.substring(0, 254))} value={text}></textarea>
                    {files.length ?
                        <div className={styles.files}>
                            {files.map((file,index) =>
                                <div className={styles.file} onClick={() => setLightbox({ images: [file.preview], show: true })} key={index}>
                                    <span className={styles.fileRemove} onClick={(e) => _handleRemoveFile(e,index)}>
                                        <img src={CloseIcon} alt="" />
                                    </span>
                                    <img src={file.preview} alt="" />
                                </div>
                            )}
                        </div>
                        : ''}
                    <div className={styles.footer}>
                        <div>
                            {text.length ? <span>{text.length}/254</span> : ''}
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="file-input">
                                <input multiple type='file' accept='image/jpeg,image/png' onChange={_handleFile} title="Upload Media" />
                                <label>
                                    <img src={ImageIcon} height="28" alt="" />
                                </label>
                            </div>
                            <Button type="submit" loading={isLoading || fileUploadLoading} className="btn primary" text='Post' />
                        </div>
                    </div>
                </form> */}
                <Composer onSubmit={_handleSubmit} submitLoading={isLoading} />
            </div>
        </div>
    );
}