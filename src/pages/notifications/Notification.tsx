// @ts-ignore
import { Notification as NotificationType } from 'atproto/packages/api/src/client/types/app/bsky/notification/listNotifications';
import HeartFillIcon from '../../assets/like-fill.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import UserFillIcon from '../../assets/profile-fill.svg';
import ReplyFillIcon from '../../assets/reply-fill.svg';
import RepostFillIcon from '../../assets/repost-fill.svg';
import styles from './Notification.module.scss';

export default function Notification(props: {
    notif: NotificationType
}) {
    const {notif} = props;

    return (
        <div className={styles.notification}>
            <div className={styles.left}>
                <div className={styles.type}>
                    <img src={
                        // @ts-ignore
                        {like: HeartFillIcon, repost: RepostFillIcon, follow: UserFillIcon, reply: ReplyFillIcon}[notif.reason]} alt="" />
                </div>
                <div className={styles.avatar}>
                    <img src={notif.author.avatar || AvatarPlaceholder} alt="" />
                </div>
            </div>
            <div className={styles.right}>
                {notif.reason == 'like' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> liked your post</p> : ''}
                {notif.reason == 'repost' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> reposted your post</p> : ''}
                {notif.reason == 'follow' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> followed you</p> : ''}
                {notif.reason == 'mention' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> mentioned you in their post</p> : ''}
                {notif.reason == 'reply' ? <p className={styles.headerText}><strong>{notif.author.displayName || notif.author.handle}</strong> replied to your post</p> : ''}
                {(notif.post as any)?.record?.text ? <p dir="auto" className={styles.text}>{(notif.post as any)?.record?.text}</p> : ''}
            </div>
        </div>
    );
}