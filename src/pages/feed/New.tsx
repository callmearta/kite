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
import styles from '../../components/NewModal/New.module.scss';
import { lightboxAtom } from '../../store/lightbox';
import { userAtom } from '../../store/user';

export default function New(props: {}) {
    const user: any = useAtomValue(userAtom);
    const queryClient = useQueryClient();
    const [text, setText] = useState('');
    const [lightbox, setLightbox] = useAtom(lightboxAtom);
    const [files, setFiles] = useState<any[]>([]);
    const [fileUploadLoading,setFileUploadLoading] = useState(false);
    const { mutate, isLoading } = useMutation((d: Record) => agent.api.app.bsky.feed.post.create({ repo: agent.session?.did }, d), {
        onSuccess: d => {
            setText('');
            setFiles([]);
            setFileUploadLoading(false);
            queryClient.invalidateQueries(["skyline"]);
        },
        onError: error => {
            console.error(error);
        }
    });

    const _handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if ((!text.length && !files.length) || isLoading || fileUploadLoading) return;
        
        const filesUpload = await _handleFilesUpload();
        const rt = new RichText({ text });
        await rt.detectFacets(agent);

        let data = {
            createdAt: new Date().toISOString(),
            text: rt.text,
            facets: rt.facets,
            $type: 'app.bsky.feed.post',
        }
        if(filesUpload.length){
            // @ts-ignore
            data.embed = {
                $type: "app.bsky.embed.images",
                images: filesUpload.length ? filesUpload.map(i => ({ alt: "", image: i.data.blob.original })) : undefined
            }
        }

        mutate(data)
    };

    const _handleFilesUpload = async () => {
        setFileUploadLoading(true);
        const results = await Promise.all(
            files.map(_handleFileUpload)
        )
        return results;
    };

    const _handleFileUpload = async (file: { file: File }) => {
    const buffer = await file.file.arrayBuffer();
        const result = await agent.uploadBlob(buffer as any, {
            encoding: file.file.type
        });
        return result;
    }

    const _handleCtrlEnter = (e: any) => {
        if (e.ctrlKey && e.keyCode == 13) {
            _handleSubmit(e);
        }
    };

    const _handleFile = async (e: any) => {
        const selectedFiles = e.target.files;
        let filesArray = Array.from(selectedFiles);
        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            filesArray[i] = { file: file, preview: URL.createObjectURL(file as Blob) };
        }
        setFiles(filesArray);
    };

    const _handleRemoveFile = (e: any,index:number) => {
        e.preventDefault();
        e.stopPropagation();
        let newFiles = [...files];
        newFiles.splice(index,1);
        setFiles(newFiles);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.left}>
                <div className={styles.avatar}>
                    <img src={user?.avatar || AvatarPlaceholder} alt="" />
                </div>
            </div>
            <div className={styles.right}>
                <form onSubmit={_handleSubmit}>
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
                </form>
            </div>
        </div>
    );
}