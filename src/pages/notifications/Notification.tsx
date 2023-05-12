// @ts-ignore
import { PostView } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { Notification as NotificationType } from '@atproto/api/src/client/types/app/bsky/notification/listNotifications';
import cn from 'classnames';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowDownIcon from '../../assets/arrow.svg';
import HeartFillIcon from '../../assets/like-fill.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import UserFillIcon from '../../assets/profile-fill.svg';
import UserIcon from '../../assets/profile.svg';
import ReplyFillIcon from '../../assets/reply-fill.svg';
import RepostFillIcon from '../../assets/repost-fill.svg';
import RepostIcon from '../../assets/repost.svg';
import Image from '../../components/Blue/Embed/Image';
import Record from '../../components/Blue/Embed/Record';
import User from '../../components/Right/User';
import Wave from '../../components/Wave';
import convertURIToBinary from '../../utils/convertURIToBinary';
import linkFromPost from '../../utils/linkFromPost';
import styles from './Notification.module.scss';

export default function Notification(props: {
    notif: NotificationType | any
}) {
    const { notif: notifGroup } = props;
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isReply = notifGroup.reason == 'reply';
    const [audio,setAudio] = useState<any>(null);

    const _handleClick = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (notifGroup.reason == 'follow') {
            return navigate(`/user/${notifGroup.datas[0].author.handle}`);
        }
        if (notifGroup.reason == 'quote' || notifGroup.reason == 'mention') {
            return navigate(linkFromPost(notifGroup.datas[0]));
        }
        if (notifGroup.post || isReply) {
            return navigate(linkFromPost(null, notifGroup.subjectUri));
        }
    };

    const _linkToProfile = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        navigate(`/user/${notifGroup.datas[0].author.handle}`);
    }

    const displayName = useMemo(() => {
        if (notifGroup.datas.length && notifGroup.datas.length - 1 > 0) {
            // @ts-ignore
            return `${notifGroup.datas[0]?.author.displayName || notifGroup.datas[0]?.author.handle}${', ' + notifGroup.datas.slice(1, Math.min(3, notifGroup.datas.length)).map(notif => (notif.author.displayName || '@' + notif.author.handle)).join(',')} and ${notifGroup.datas.length > 3 ? notifGroup.datas.length - 3 : notifGroup.datas.length - 1} others`;
        } else {
            return notifGroup.datas[0]?.author.displayName || notifGroup.datas[0]?.author.handle;
        }
    }, [notifGroup.datas[0]]);

    const _handleOpen = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        if (!(notifGroup.post as any)?.record?.kiteAudio) return;
        let binary = convertURIToBinary((notifGroup.post as any)?.record?.kiteAudio);
        let blob = new Blob([binary], {
            type: 'audio/ogg'
        });
        let blobUrl = URL.createObjectURL(blob);
        setAudio(blobUrl);
    }, [(notifGroup.post as any)?.record?.kiteAudio]);

    return (
        <div className={cn(styles.notification, { "pointer": true, [styles.hover]: true, [styles.new]: !notifGroup.datas[0]?.isRead })} onClick={_handleClick}>
            <div className={styles.left}>
                <div className={styles.type} onClick={_handleOpen}>
                    <img src={
                        // @ts-ignore
                        { like: HeartFillIcon, repost: RepostFillIcon, follow: UserFillIcon, reply: ReplyFillIcon, quote: RepostIcon, mention: UserIcon }[notifGroup.reason]} alt="" />
                    {notifGroup.datas.length > 1 ? <span className={cn(styles.arrow, { [styles.isOpen]: isOpen })} onClick={_handleOpen}>
                        <img src={ArrowDownIcon} alt="" />
                    </span> : ''}
                </div>
                {isOpen ?
                    <div className={styles.openAvatars}>
                        {notifGroup.datas.map((notif: any) => <User className={styles.user} hideFollowIndicator key={notif.author.did} user={notif.author} />)}
                    </div>
                    : <div className={styles.avatars}>

                        {[...notifGroup.datas].slice(0, 4).map(notif => <div key={notif.author.did + '-closed'} className={styles.avatar} onClick={e => notifGroup.datas.length > 1 ? _handleOpen(e) : _linkToProfile(e)}>
                            <img src={notif?.author.avatar || AvatarPlaceholder} alt="" />
                        </div>
                        )}
                        {notifGroup.datas.length > 4 ? <div className={styles.avatar} onClick={_handleOpen}>
                            <span>+{notifGroup.datas.length - 4}</span>
                        </div> : ''}
                    </div>}
            </div>
            <div className={styles.right}>
            </div>
            <div className={styles.info}>
                {notifGroup.reason == 'like' ? <p className={styles.headerText}><strong>{displayName}</strong> liked your post</p> : ''}
                {notifGroup.reason == 'quote' ? <p className={styles.headerText}><strong>{displayName}</strong> quoted your post</p> : ''}
                {notifGroup.reason == 'repost' ? <p className={styles.headerText}><strong>{displayName}</strong> reposted your post</p> : ''}
                {notifGroup.reason == 'follow' ? <p className={styles.headerText}><strong>{displayName}</strong> followed you</p> : ''}
                {notifGroup.reason == 'mention' ? <p className={styles.headerText}><strong>{displayName}</strong> mentioned you in their post</p> : ''}
                {isReply ?
                    <>
                        <p className={styles.headerText}><strong>{notifGroup.datas[0].author.displayName || notifGroup.datas[0].author.handle}</strong> replied to your post</p>
                        {/* <p dir="auto" className={styles.text}>{(notifGroup.datas[0].record as any).text}</p> */}
                    </>
                    : ''}
                {(notifGroup.post as any)?.record?.text ? <p dir="auto" className={styles.text}>{(notifGroup.post as any)?.record?.kiteText || (notifGroup.post as any)?.record?.text}</p> : ''}
                {(notifGroup.post as any)?.record?.kiteAudio && audio ? <Wave audioUrl={audio} /> : ''}
                {(notifGroup.post as any) && notifGroup.post.embed && notifGroup.reason != 'quote' && notifGroup.reason != 'mention' ? <Image embed={(notifGroup.post.embed as any)} /> : ''}
                {/* {notif.reason == 'quote' || notif.reason == 'mention' ? <p dir="auto" className={styles.text}>{(notif as any)?.record?.text}</p> : ''} */}
                {notifGroup.reason == 'mention' || notifGroup.reason == 'quote' || notifGroup.reason == 'reply' ? <Record isNotif isQuote embed={(notifGroup.datas[0] as any)} post={notifGroup.post} /> : ''}
            </div>
        </div>

    );
}