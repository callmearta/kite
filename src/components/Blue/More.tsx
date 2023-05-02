import { FeedViewPost, PostView } from 'atproto/packages/api/src/client/types/app/bsky/feed/defs';
import { useAtomValue } from 'jotai';
import { SyntheticEvent, useState } from 'react';
import { Portal } from 'react-portal';
import agent from '../../Agent';
import CopyIcon from '../../assets/copy.svg';
import DeleteIcon from '../../assets/delete.svg';
import MoreIcon from '../../assets/dots.svg';
import { userAtom } from '../../store/user';
import linkFromPost from '../../utils/linkFromPost';
import Loading from '../Loading';
import styles from './Blue.module.scss';

export default function More(props: {
    post: PostView | FeedViewPost,
    setDeleted: Function
}) {
    const user = useAtomValue(userAtom);
    const { post, setDeleted } = props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const _handleDropdown = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setDropdownOpen(prev => !prev);
    }

    const _handleDeletePost = async (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setDeleteLoading(true);

        try {
            const result = await agent.deletePost(post.uri as string);
            setDeleted(true);
        }
        catch (error) {
            console.error(error);
        }
    };

    const _handleCopyKiteUrl = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const url = linkFromPost(post);
        navigator.clipboard.writeText(`https://kite.black/#${url}`);
        setDropdownOpen(false);
    }

    const _handleCopyBskyUrl = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const split = (post?.uri as string)?.split('/');
        const rkey = split[split.length - 1];
        const url = `https://staging.bsky.app/profile/${(post?.author as any)?.handle}/post/${rkey}`;
        navigator.clipboard.writeText(url);
        setDropdownOpen(false);
    }
    
    const _handleCopyPskyUrl = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        const split = (post?.uri as string)?.split('/');
        const rkey = split[split.length - 1];
        const url = `https://psky.app/profile/${(post?.author as any)?.handle}/post/${rkey}`;
        navigator.clipboard.writeText(url);
        setDropdownOpen(false);
    }

    return (
        <>
            <button title="" className={styles.more} type="button" onClick={_handleDropdown}>
                <div className={styles.moreIcon}>
                    <img src={MoreIcon} alt="More" />
                </div>
                {dropdownOpen ?
                    <div className={styles.repostDropdown}>
                        {(post.author as any)?.did == user?.did ?
                            <p className="font-weight-bold" onClick={_handleDeletePost}>
                                {deleteLoading ? <Loading isColored /> : <img src={DeleteIcon} alt="" />}
                                <span>Delete Post</span>
                            </p>
                            : ''}
                        <p className="font-weight-bold" onClick={_handleCopyKiteUrl}>
                            <img src={CopyIcon} alt="Copy" />
                            <span>Copy Kite URL</span>
                        </p>
                        <p className="font-weight-bold" onClick={_handleCopyBskyUrl}>
                            <img src={CopyIcon} alt="Copy" />
                            <span>Copy Bsky URL</span>
                        </p>
                        <p className="font-weight-bold" onClick={_handleCopyPskyUrl}>
                            <img src={CopyIcon} alt="Copy" />
                            <span>Copy Psky URL</span>
                        </p>
                    </div>
                    : ''}
            </button>
            {dropdownOpen ? <Portal>
                <div className={styles.repostBackdrop} onClick={_handleDropdown}></div>
            </Portal> : ''}
        </>
    );
}