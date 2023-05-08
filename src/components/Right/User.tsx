import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import AvatarPlaceholder from '../../assets/placeholder.png';
import styles from './Right.module.scss';

export default function User(props: {
    user: any,
    hideFollowIndicator?: boolean,
    className?:string
}) {
    const { user, hideFollowIndicator, className } = props;
    const navigate = useNavigate();

    const _handleClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const userLink = `/user/${user.handle}`;
        if (e.ctrlKey || e.which == 2) {
            window.open(userLink, "_blank");
        } else {
            navigate(userLink);
        }
    };

    return (
        <div className={cn('user', styles.user, className)} onClick={_handleClick}>
            <div className={styles.avatar}>
                <img src={user.avatar || AvatarPlaceholder} alt="" />
            </div>
            <div className={styles.userRight}>
                <p className="font-weight-bold">
                    {user.displayName}
                </p>
                <span>@{user.handle}</span>
                {user.viewer.followedBy && !hideFollowIndicator ? <span className={styles.tag}>Follows You</span> : ''}
            </div>
        </div>
    );
}