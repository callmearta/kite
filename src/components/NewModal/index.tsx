import { RichText } from "atproto/packages/api";
import { Record as RecordType } from "atproto/packages/api/src/client/types/app/bsky/feed/post";
import cn from 'classnames';
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { Portal } from "react-portal";
import { useMutation, useQueryClient } from "react-query";
import agent from "../../Agent";
import AvatarPlaceholder from '../../assets/placeholder.png';
import { newAtom } from "../../store/new";
import { userAtom } from "../../store/user";
import Blue from "../Blue/Blue";
import Record from "../Blue/Embed/Record";
import Button from "../Button";
import styles from './New.module.scss';

export default function NewModal(props: {}) {
    const user: any = useAtomValue(userAtom);
    const [newModal, setNewModal] = useAtom(newAtom);
    const [text, setText] = useState('');
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutation((d: RecordType) => agent.post(d), {
        onSuccess: d => {
            setText('');
            setNewModal({ show: false, post: null, cid: null });
            queryClient.invalidateQueries(["skyline"]);
        },
        onError: error => {
            console.error(error);
        }
    });

    const _handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!text.length) return;
        const rt = new RichText({ text });
        await rt.detectFacets(agent);

        mutate({
            createdAt: new Date().toISOString(),
            text: rt.text,
            reply: {
                root: {
                    cid: newModal.cid!,
                    // @ts-ignore
                    uri: newModal.post?.uri!
                },
                parent: {
                    cid: newModal.cid!,
                    // @ts-ignore
                    uri: newModal.post.uri
                }
            },
            facets: rt.facets,
            $type: 'app.bsky.feed.post',
        })
    };

    const _handleCtrlEnter = (e: any) => {
        if (e.ctrlKey && e.keyCode == 13) {
            _handleSubmit(e);
        }
    };

    return (

        <div className={styles.modal}>
            <div className={styles.backdrop} onClick={() => setNewModal({ show: false, cid: null, post: null })}></div>
            <div className={styles.wrapper}>
                <div className={styles.postWrapper}>
                    <Blue isParent={true} post={newModal.post as any} className={styles.post} />
                </div>
                <div className={styles.modalWrapper}>
                    <div className={styles.left}>
                        <div className={styles.avatar}>
                            <img src={user?.avatar || AvatarPlaceholder} alt="" />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <form onSubmit={_handleSubmit}>
                            <textarea dir="auto" className={cn({ [styles.open]: text.length })} placeholder="What's on your mind?" onKeyDown={_handleCtrlEnter} onChange={e => setText(e.target.value.substring(0, 254))} value={text} maxLength={254}></textarea>
                            <div className={styles.footer}>
                                <div>
                                    {text.length ? <span>{text.length}/254</span> : ''}
                                </div>
                                <Button type="submit" loading={isLoading} className="btn primary" text='Post' />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}