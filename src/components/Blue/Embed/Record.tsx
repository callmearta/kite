import { AppBskyActorDefs, AppBskyEmbedRecord } from '@atproto/api';
import { Link, useNavigate } from 'react-router-dom';
import linkFromPost from '../../../utils/linkFromPost';
import Blue from '../Blue';
import styles from '../Blue.module.scss';

export default function Record(props: {
    embed: AppBskyEmbedRecord.View
}) {
    const { embed } = props;
    const author = embed.record.author || embed.author as AppBskyActorDefs.ProfileView | any;
    const uri = embed?.record?.uri || embed.uri as string;
    const navigate = useNavigate();

    const _handleLink = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey) {
            window.open(linkFromPost(embed.record), "_blank");
        } else {
            navigate(linkFromPost(embed.record));
        }

    };

    return (
        embed && uri ? <div onClick={_handleLink} className={styles.record}>
            <div className={styles.recordHeader}>
                <div className={styles.recordAvatar}>
                    <img src={(author as AppBskyActorDefs.ProfileView)?.avatar} alt={author.displayName} />
                </div>
                <div>
                    <p className="font-weight-bold">{(author as AppBskyActorDefs.ProfileView)?.displayName}</p>
                    <span className="text-grey">{(author as AppBskyActorDefs.ProfileView).handle}</span>
                </div>
            </div>
            <div className={styles.recordBody}>
                <p dir="auto">{(embed.record.value || embed.record as any)?.text}</p>
            </div>
        </div> : null
    );
}