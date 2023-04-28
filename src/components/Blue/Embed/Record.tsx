import { AppBskyActorDefs, AppBskyEmbedImages, AppBskyEmbedRecord } from 'atproto/packages/api';
import { Link, useNavigate } from 'react-router-dom';
import AvatarPlaceholder from '../../../assets/placeholder.png';
import linkFromPost from '../../../utils/linkFromPost';
import Blue from '../Blue';
import styles from '../Blue.module.scss';
import Image from './Image';

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
        if(e.target.tagName == 'IMG') return;
        if (e.ctrlKey) {
            window.open(linkFromPost(embed.record), "_blank");
        } else {
            navigate(linkFromPost(embed.record));
        }
    };

    console.log(embed.record.embeds);

    return (
        embed && uri ? <div onClick={_handleLink} className={styles.record}>
            <div className={styles.recordHeader}>
                <div className={styles.recordAvatar}>
                    <img src={(author as AppBskyActorDefs.ProfileView)?.avatar || AvatarPlaceholder} alt={author.displayName} />
                </div>
                <div>
                    <p className="font-weight-bold">{(author as AppBskyActorDefs.ProfileView)?.displayName}</p>
                    <span className="text-grey">{(author as AppBskyActorDefs.ProfileView).handle}</span>
                </div>
            </div>
            <div className={styles.recordBody}>
                <p dir="auto">{(embed.record.value || embed.record as any)?.text}</p>
            </div>
            {AppBskyEmbedImages.isView((embed.record.embeds as any)[0]) ? <Image embed={(embed.record.embeds as any)[0]} /> : ''}
        </div> : null
    );
}