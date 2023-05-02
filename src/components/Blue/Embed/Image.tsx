import { AppBskyEmbedImages, AppBskyEmbedRecordWithMedia } from 'atproto/packages/api';
import { useSetAtom } from 'jotai';
import { lightboxAtom } from '../../../store/lightbox';
import Lightbox from '../../Lightbox';
import styles from '../Blue.module.scss';

export default function Image(props: {
    embed: AppBskyEmbedImages.View | AppBskyEmbedRecordWithMedia.View
}) {
    const { embed } = props;
    const setLightbox = useSetAtom(lightboxAtom);

    const _showLightbox = () => {
        setLightbox({
            // @ts-ignore
            images: embed.images || embed.media.images,
            show: true
        });
    };

    return (
        <>
            <div className={styles.image}>
                {
                // @ts-ignore
                (embed.images || embed.media.images)?.map((img, index) => <div key={index}><img onClick={_showLightbox} src={img.thumb} alt={img.alt} /></div>)}
            </div>
            {/* <Lightbox /> */}
        </>
    );
}