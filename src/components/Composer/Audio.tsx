import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import MicFillIcon from '../../assets/mic-fill.svg';
import MicIcon from '../../assets/mic.svg';
import Wave from "../Wave";
import styles from './Composer.module.scss';

export default function Audio(props: {
    setAudio: any
}) {
    const { setAudio: propSetAudio } = props;
    const [perm, setPerm] = useState(false);
    const [stream, setStream] = useState<any>(null);
    const mediaRecorder = useRef<any>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioChunks, setAudioChunks] = useState<any[]>([]);
    const [audio, setAudio] = useState<any>(null);
    const [audio64, setAudio64] = useState<any>(null);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<any>(null);
    const mimeType = "audio/webm";

    const _handleClick = async () => {
        if (recordingStatus == 'inactive') {
            const streamData = await _getPermission();
            if (!streamData) toast("Access to microphone blocked");
            setStream((prev: any) => {
                if (prev) {
                    prev.getTracks().forEach((track: any) => track.stop());
                }
                return streamData
            });
            startRecording(streamData);
        } else {
            setStream((prev: any) => {
                stopRecording(prev);
                return prev;
            })
        }
    };

    const _getPermission = () => {
        return new Promise(async (resolve, reject) => {
            if ("MediaRecorder" in window) {
                try {
                    const streamData = await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });
                    resolve(streamData);
                } catch (err) {
                    resolve(false);
                }
            } else {
                toast("Not supported");
            }
        });
    };
    const startRecording = async (stream: any) => {
        setRecordingStatus("recording");
        // @ts-ignore
        const media = new MediaRecorder(stream, { type: mimeType, audioBitsPerSecond: 16000, bitsPerSecond: 16000 });

        mediaRecorder.current = media;

        mediaRecorder.current.start();
        let localAudioChunks: any[] = [];
        mediaRecorder.current.ondataavailable = (event: any) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        setAudioChunks(localAudioChunks);
    };

    useEffect(() => {
        if (timer > 29 && stream) {
            return stopRecording(stream);
        }
    }, [timer, stream]);

    const stopRecording = (stream: any) => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            clearInterval(timerRef.current);
            setTimer(0);
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            //creates a playable URL from the blob file.
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            var reader = new FileReader();
            reader.onload = function (event: any) {
                var binaryString = event.target.result;
                setAudio64(binaryString);
                propSetAudio(binaryString);
            };
            reader.readAsDataURL(audioBlob);

            setAudioChunks([]);

            stream.getTracks().forEach((track: any) => track.stop())
        };
    };

    return (
        <>
            <button className={cn(styles.voice, { [styles.voiceActive]: recordingStatus != 'inactive' })} title="Voice" type="button" onClick={_handleClick}>
                <img src={recordingStatus == 'inactive' ? MicIcon : MicFillIcon} alt="" />
                {timer && recordingStatus == 'recording' ? <span className={cn({ 'span-error': timer > 30 })}>{timer}</span> : ''}
            </button>
        </>
    );
}