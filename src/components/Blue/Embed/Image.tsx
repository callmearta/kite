import { AppBskyEmbedImages, AppBskyEmbedRecordWithMedia, BlobRef } from '@atproto/api';
import cn from 'classnames';
import { useSetAtom } from 'jotai';
import { lightboxAtom } from '../../../store/lightbox';
import Lightbox from '../../Lightbox';
import styles from '../Blue.module.scss';

export default function Image(props: {
    embed: AppBskyEmbedImages.View | AppBskyEmbedRecordWithMedia.View
}) {
    const { embed } = props;
    const hasUri = (embed?.images || (embed?.media as any)?.images)?.filter((img: any) => (img?.image instanceof BlobRef));
    if (hasUri && hasUri.length) return null;
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
            <div className={cn(styles.image, { [styles.multipleImage]: (embed.images || (embed.media as any)?.images)?.length > 1, [styles.fourImages]: (embed.images || (embed.media as any)?.images)?.length == 4 })}>
                {
                    // @ts-ignore
                    (embed.images || embed.media?.images)?.map((img, index) => <div key={index}><img onClick={_showLightbox} src={img.thumb ? img.thumb : img.image} alt={img.alt} /></div>)
                }
            </div>
        </>
    );
}