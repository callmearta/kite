// @ts-ignore
import { PostView } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { Notification as NotificationType } from '@atproto/api/src/client/types/app/bsky/notification/listNotifications';
import cn from 'classnames';
import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import HeartFillIcon from '../../assets/like-fill.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import UserFillIcon from '../../assets/profile-fill.svg';
import UserIcon from '../../assets/profile.svg';
import ReplyFillIcon from '../../assets/reply-fill.svg';
import RepostFillIcon from '../../assets/repost-fill.svg';
import RepostIcon from '../../assets/repost.svg';
import Record from '../../components/Blue/Embed/Record';
import linkFromPost from '../../utils/linkFromPost';
import styles from './Notification.module.scss';

export default function Notification(props: {
    notif: NotificationType
}) {
    const { notif } = props;
    const navigate = useNavigate();
    const isReply = notif.reason == 'reply';

    const _handleClick = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (notif.post || isReply) {
            navigate(linkFromPost(notif.post || notif));
        }
        if(notif.reason == 'follow'){
            navigate(`/user/${notif.author.handle}`);
        }
        if(notif.reason == 'quote' || notif.reason == 'mention'){
            navigate(linkFromPost(notif));
        }
    };

    const _linkToProfile = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        navigate(`/user/${notif.author.handle}`);
    }

    return (
        <div className={cn(styles.notification, { "pointer": true, [styles.hover]: true, [styles.new]: !notif.isRead })} onClick={_handleClick}>
            <div className={styles.left}>
                <div className={styles.type}>
                    <img src={
                        // @ts-ignore
                        { like: HeartFillIcon, repost: RepostFillIcon, follow: UserFillIcon, reply: ReplyFillIcon, quote: RepostIcon, mention: UserIcon }[notif.reason]} alt="" />
                </div>
                <div className={styles.avatar} onClick={_linkToProfile}>
                    <img src={notif.author.avatar || AvatarPlaceholder} alt="" />
                </div>
            </div>
            <div className={styles.right}>
                {notif.reason == 'like' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> liked your post</p> : ''}
                {notif.reason == 'quote' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> quoted your post</p> : ''}
                {notif.reason == 'repost' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> reposted your post</p> : ''}
                {notif.reason == 'follow' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> followed you</p> : ''}
                {notif.reason == 'mention' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> mentioned you in their post</p> : ''}
                {isReply ?
                    <>
                        <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> replied to your post</p>
                        <p dir="auto" className={styles.text}>{(notif.record as any).text}</p>
                    </>
                    : ''}
                {(notif.post as any)?.record?.text ? <p dir="auto" className={styles.text}>{(notif.post as any)?.record?.text}</p> : ''}
                {/* {notif.reason == 'quote' || notif.reason == 'mention' ? <p dir="auto" className={styles.text}>{(notif as any)?.record?.text}</p> : ''} */}
                {notif.reason == 'mention' || notif.reason == 'quote' ? <Record isNotif isQuote embed={(notif as any)} /> : ''}
            </div>
        </div>
    );
}