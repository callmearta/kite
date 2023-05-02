import { AppBskyEmbedExternal } from '@atproto/api';
import { Link } from 'react-router-dom';
import styles from '../Blue.module.scss';

export default function External(props: {
    embed: AppBskyEmbedExternal.View
}) {
    const { embed } = props;

    return (
        <Link target='_blank' title={embed.external.title} to={embed.external.uri} className={styles.external}>
            {embed.external.thumb ? <div className={styles.externalImage}>
                <img src={embed.external.thumb} alt="" />
            </div> : ''}
            <div className={styles.externalDetail}>
                <h4>{embed.external.title || embed.external.uri}</h4>
                <p>{embed.external.description}</p>
            </div>
        </Link>
    );
}