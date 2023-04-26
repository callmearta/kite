import { RichText } from '@atproto/api';
import { Record } from '@atproto/api/dist/client/types/app/bsky/feed/post';
import cn from 'classnames';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import agent from '../../Agent';
import Button from '../../components/Button';
import styles from '../../components/NewModal/New.module.scss';
import { userAtom } from '../../store/user';

export default function New(props: {}) {
    const user: any = useAtomValue(userAtom);
    const queryClient = useQueryClient();
    const [text, setText] = useState('');
    const { mutate, isLoading } = useMutation((d: Record) => agent.api.app.bsky.feed.post.create({ repo: agent.session?.did }, d), {
        onSuccess: d => {
            setText('');
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
        <div className={styles.wrapper}>
            <div className={styles.left}>
                <div className={styles.avatar}>
                    <img src={user?.avatar} />
                </div>
            </div>
            <div className={styles.right}>
                <form onSubmit={_handleSubmit}>
                    <textarea className={cn({ [styles.open]: text.length })} placeholder="What's on your mind?" onKeyDown={_handleCtrlEnter} onChange={e => setText(e.target.value.substring(0, 254))} value={text}></textarea>
                    <div className={styles.footer}>
                        <div>
                            {text.length ? <span>{text.length}/254</span> : ''}
                        </div>
                        <Button type="submit" loading={isLoading} className="btn primary" text='Post' />
                    </div>
                </form>
            </div>
        </div>
    );
}