import { FeedViewPost, PostView } from 'atproto/packages/api/src/client/types/app/bsky/feed/defs';
import { SyntheticEvent, useState } from 'react';
import { Portal } from 'react-portal';
import agent from '../../Agent';
import DeleteIcon from '../../assets/delete.svg';
import MoreIcon from '../../assets/dots.svg';
import Loading from '../Loading';
import styles from './Blue.module.scss';

export default function More(props: {
    post: PostView | FeedViewPost,
    setDeleted: Function
}) {
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

    return (
        <>
            <button title="" className={styles.more} type="button" onClick={_handleDropdown}>
                <div className={styles.moreIcon}>
                    <img src={MoreIcon} alt="More" />
                </div>
                {dropdownOpen ?
                    <div className={styles.repostDropdown}>
                        <p className="font-weight-bold" onClick={_handleDeletePost}>
                            {deleteLoading ? <Loading /> : <img src={DeleteIcon} alt="" />}
                            <span>Delete Post</span>
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