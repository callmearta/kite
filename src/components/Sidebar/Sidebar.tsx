import { ProfileRecord } from '@atproto/api';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import cn from 'classnames';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import agent, { SESSION_LOCAL_STORAGE_KEY } from '../../Agent';
import AvatarPlaceholder from '../../assets/avatar-placeholder.svg';
import HomeFillIcon from '../../assets/home-fill.svg';
import HomeIcon from '../../assets/home.svg';
import LogoutIcon from '../../assets/logout.svg';
import ProfileFillIcon from '../../assets/profile-fill.svg';
import ProfileIcon from '../../assets/profile.svg';
import styles from './Sidebar.module.scss';

export default function Sidebar(props: {
    data: ProfileView | any
}) {
    const { data } = props;
    const location = useLocation();

    const ITEMS = [
        {
            path: '/',
            icon: HomeIcon,
            fillIcon: HomeFillIcon,
            text: 'Home'
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
                {ITEMS.map((i,index) =>
                    <Link key={index} to={i.path} className={cn({ [styles.menuActive]: i.path == location.pathname })}>
                        <img src={i.path == location.pathname ? i.fillIcon : i.icon} />
                        <strong>{i.text}</strong>
                    </Link>
                )}
            </div>
        </div>
    );
}