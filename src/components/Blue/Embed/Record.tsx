import { AppBskyActorDefs, AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia } from '@atproto/api';
import { Link, useNavigate } from 'react-router-dom';
import AvatarPlaceholder from '../../../assets/placeholder.png';
import linkFromPost from '../../../utils/linkFromPost';
import Blue from '../Blue';
import styles from '../Blue.module.scss';
import Image from './Image';

export default function Record(props: {
    embed: AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View,
    author?: AppBskyActorDefs.ProfileView,
    uri?: string,
    isQuote?: boolean,
    isNotif?: boolean,
    post?: any
}) {
    const { author: propsAuthor, uri: propsUri, isQuote, isNotif, post } = props;
    let embed = isQuote ? props.embed : (props.embed.record?.author ? props.embed : props.embed.record);
    // @ts-ignore
    const author = propsAuthor || embed?.record?.author || embed?.author as AppBskyActorDefs.ProfileView | any;
    // @ts-ignore
    const uri = propsUri || embed?.record?.uri || embed.uri as string;
    const navigate = useNavigate();

    const _handleLink = (e: any) => {
        if (isNotif) return true;
        e.preventDefault();
        e.stopPropagation();
        if (e.target.tagName == 'IMG') return;
        if (e.ctrlKey || e.button == 1) {
            window.open('/#'+linkFromPost(embed.record), "_blank");
        } else {
            navigate(linkFromPost(embed.record));
        }
    };

    return (
        embed && uri && author ? <div onClick={_handleLink} onMouseDown={_handleLink} className={styles.record}>
            <div className={styles.recordHeader}>
                <div className={styles.recordAvatar}>
                    <img src={(author as AppBskyActorDefs.ProfileView)?.avatar || AvatarPlaceholder} alt={author?.displayName} />
                </div>
                <div>
                    <p className="font-weight-bold">{(author as AppBskyActorDefs.ProfileView)?.displayName}</p>
                    <span className="text-grey">{(author as AppBskyActorDefs.ProfileView)?.handle}</span>
                </div>
            </div>
            <div className={styles.recordBody}>
                <p className="my-0" dir="auto">{
                    // @ts-ignore
                    (embed.record.value || embed.record as any)?.text}</p>
            </div>
            {
                // @ts-ignore
                isQuote ? '' : AppBskyEmbedImages.isView((embed.record.embeds as any)[0]) ? <Image embed={(embed.record.embeds as any)[0]} /> : ''}
        </div> : null
    );
}