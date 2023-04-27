import { AppBskyEmbedImages } from 'atproto/packages/api';
import { useSetAtom } from 'jotai';
import { lightboxAtom } from '../../../store/lightbox';
import Lightbox from '../../Lightbox';
import styles from '../Blue.module.scss';

export default function Image(props: {
    embed: AppBskyEmbedImages.View
}) {
    const { embed } = props;
    const setLightbox = useSetAtom(lightboxAtom);

    const _showLightbox = () => {
        setLightbox({
            images: embed.images,
            show: true
        });
    };

    return (
        <>
            <div className={styles.image}>
                {embed.images.map((img, index) => <img onClick={_showLightbox} key={index} src={img.thumb} alt={img.alt} />)}
            </div>
            {/* <Lightbox /> */}
        </>
    );
}