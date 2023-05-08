import cn from 'classnames';
import { useAtom } from "jotai";
import { SyntheticEvent, useState } from "react";
import { Portal } from "react-portal";
import { useQueryClient } from "react-query";
import Slider from 'react-slick';
import agent from "../../Agent";
import { lightboxAtom } from "../../store/lightbox";
import Loading from "../Loading";
import styles from './Lightbox.module.scss';

export default function Lightbox(props: {}) {
    const [lightbox, setLightbox] = useAtom(lightboxAtom);
    const [fleetRemoveLoading, setFleetRemoveLoading] = useState(false);
    const queryClient = useQueryClient();

    const _handleClose = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLightbox(prev => ({ ...prev, show: false, isFleet: false, meta: null }))
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const _handleRemoveFleet = async (e: SyntheticEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setFleetRemoveLoading(true);

        const rkey = lightbox.meta.data[index].uri.split('/').pop();

        const result = await agent.com.atproto.repo.deleteRecord({
            collection: 'app.bsky.actor.profile',
            repo: lightbox.meta.user.did,
            rkey: rkey
        });
        if (result.success) {
            setFleetRemoveLoading(false);
            let newImages = [...lightbox.images];
            newImages.splice(index, 1);
            if (!newImages.length) {
                setLightbox(prev => ({ ...prev, images: newImages, show: false, meta: null }));
            } else {
                setLightbox(prev => {
                    let newMeta = [...prev.meta];
                    newMeta.splice(index, 1);
                    return { ...prev, images: newImages, meta: newMeta }
                });
            }
            queryClient.invalidateQueries("fleets");
        }
    };

    return (
        lightbox.show ? <Portal>
            <div className={styles.lightbox}>
                <div className={styles.backdrop} onClick={_handleClose}></div>
                <div className={cn(styles.content, { [styles.fleetContent]: lightbox.isFleet })}>
                    {lightbox.images.length > 1 ? <Slider {...settings}>
                        {lightbox.images?.map((img, index) => <div key={index} onClick={_handleClose}>
                            {lightbox.isFleet ? <span onClick={(e) => _handleRemoveFleet(e, index)}>{fleetRemoveLoading ? <Loading isColored /> : "Remove"}</span> : ''}
                            <img src={(img as any).fullsize || img} alt="" />
                        </div>)}
                    </Slider> :
                        lightbox.images?.map((img, index) => <div key={index} onClick={_handleClose}>
                            {lightbox.isFleet ? <span onClick={e => _handleRemoveFleet(e, index)}>{fleetRemoveLoading ? <Loading isColored /> : "Remove"}</span> : ''}
                            <img src={(img as any).fullsize || img} alt="" />
                        </div>)
                    }
                </div>
            </div>
        </Portal> : null
    );
}