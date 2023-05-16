import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import CloseIcon from '../../assets/close.svg';
import PauseIcon from '../../assets/pause.svg';
import PlayIcon from '../../assets/play.svg';
import styles from './Wave.module.scss';

export default function Wave(props: {
    audioUrl: any,
    onRemove?: any
}) {
    const { audioUrl, onRemove } = props;
    const [playing, setPlaying] = useState(false);
    const waveform = useRef<any>(null);
    const audioRef = useRef<any>(null);
    const waveRef = useRef<any>(null);
    const [times,setTimes] = useState<any>(null);

    const _init = () => {
        if (waveform.current) {
            waveform.current.destroy();
        }
        waveform.current = WaveSurfer.create({
            barWidth: 3,
            barRadius: 3,
            barGap: 2,
            barMinHeight: 2,
            cursorWidth: 1,
            container: waveRef.current,
            backend: "WebAudio",
            height: 60,
            progressColor: "#111111",
            responsive: true,
            waveColor: "#C4C4C4",
            cursorColor: "transparent"
        });
        waveform.current.load(audioRef.current);
        waveform.current.on('interaction ',(e:any) => {
            e.preventDefault();
            e.stopPropagation();
        });
        waveform.current.on('finish', () => setPlaying(false));
        waveform.current.on('ready', () => {
            setTimes({
                total: waveform.current.getDuration()
            })
        });
    };

    useEffect(() => {
        if (!audioRef.current || !waveRef.current) return;
        _init();

    }, [audioUrl]);

    const _handlePlayPause = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        setPlaying(prev => {
            if (prev) {
                waveform.current.pause();
            } else {
                waveform.current.play();
            }
            return !prev;
        });
    };

    return (
        <div className={styles.container}>
            {onRemove ? <div className={styles.remove} onClick={onRemove}>
                <img src={CloseIcon} alt="" />
            </div> : ''}
            <div className={styles.play} onClick={_handlePlayPause}>
                <img src={playing ? PauseIcon : PlayIcon} alt="" />
            </div>
            <div ref={waveRef} className={styles.wave}></div>
            {times ? <div className={styles.length}>{times.total.toFixed(1)}s</div> : ''}
            <audio src={audioUrl} ref={audioRef} />
        </div>
    );
}