import { ProfileRecord } from 'atproto/packages/api';
import { ProfileView } from 'atproto/packages/api/dist/client/types/app/bsky/actor/defs';
import cn from 'classnames';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';
import agent, { SESSION_LOCAL_STORAGE_KEY } from '../../Agent';
import HomeFillIcon from '../../assets/home-fill.svg';
import HomeIcon from '../../assets/home.svg';
import KiteIcon from '../../assets/kite.png';
import LogoutIcon from '../../assets/logout.svg';
import NotificationFillIcon from '../../assets/notification-fill.svg';
import NotificationIcon from '../../assets/notification.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import ProfileFillIcon from '../../assets/profile-fill.svg';
import ProfileIcon from '../../assets/profile.svg';
import styles from './Sidebar.module.scss';

export default function Sidebar(props: {
    data: ProfileView | any
}) {
    const { data } = props;
    const { data: notificationData } = useQuery(["notifications"], () => agent.listNotifications({}));
    const unreadCount = notificationData?.data.notifications.filter(i => !i.isRead).length || 0;
    const location = useLocation();

    const ITEMS = [
        {
            path: '/',
            icon: HomeIcon,
            fillIcon: HomeFillIcon,
            text: 'Home'
        },
        {
            path: '/notifications',
            icon: NotificationIcon,
            fillIcon: NotificationFillIcon,
            text: 'Notifications'
        },
        {
            path: `/user/${data.handle}`,
            icon: ProfileIcon,
            fillIcon: ProfileFillIcon,
            text: 'Profile'
        },
        {
            path: '/logout',
            icon: LogoutIcon,
            fillIcon: LogoutIcon,
            text: 'Logout'
        }
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <img src={KiteIcon} alt="Kite | a better bluesky client" />
                <h1>Kite</h1>
            </div>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    <img src={data?.avatar || AvatarPlaceholder} alt={data?.displayName} />
                </div>
                <div>
                    <strong className="d-block">{data?.displayName}</strong>
                    <span className="d-block">{'@' + data?.handle}</span>
                </div>
            </div>
            <div className={styles.menu}>
                {ITEMS.map((i, index) =>
                    <Link key={index} to={i.path} className={cn(styles.menuItem,{ [styles.menuActive]: i.path == location.pathname })}>
                        <img alt="" src={i.path == location.pathname ? i.fillIcon : i.icon} />
                        <strong>
                            {i.text}
                            {unreadCount && i.path == '/notifications' ? <span className={styles.badge}>{unreadCount}</span> : ''}
                        </strong>
                    </Link>
                )}
            </div>
        </div>
    );
}