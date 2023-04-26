import { useAtom } from "jotai";
import { SyntheticEvent } from "react";
import { Portal } from "react-portal";
import { lightboxAtom } from "../../store/lightbox";
import styles from './Lightbox.module.scss';

export default function Lightbox(props: {}) {
    const [lightbox, setLightbox] = useAtom(lightboxAtom);

    const _handleClose = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLightbox(prev => ({ ...prev, show: false }))
    };

    return (
        lightbox.show ? <Portal>
            <div className={styles.lightbox}>
                <div className={styles.backdrop} onClick={_handleClose}></div>
                <div className={styles.content}>
                    {lightbox.images?.map((img,index) => <div key={index}><img src={(img as any).fullsize || img} /></div>)}
                </div>
            </div>
        </Portal> : null
    );
}