import { FeedViewPost, PostView } from "@atproto/api/src/client/types/app/bsky/feed/defs";
import { useAtom, useSetAtom } from "jotai";
import { SyntheticEvent } from "react";
import { Portal } from "react-portal";
import CommentsIcon from '../../assets/comments.svg';
import { newAtom } from "../../store/new";
import NewModal from "../NewModal";
import styles from './Blue.module.scss';

export default function Comments(props: {
    post: PostView | FeedViewPost | any
}) {
    const { post } = props;
    const [newModal, setNewModal] = useAtom(newAtom);

    const _handleClick = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setNewModal({ show: true, cid: post.cid, post: post })
    };

    return (
        <>
            <div className={styles.comments} onClick={_handleClick}>
                <div className={styles.icon}>
                    <img src={CommentsIcon} alt="" />
                </div>
                {post.replyCount ? <span>{post.replyCount}</span> : ''}
            </div>
        </>
    );
}