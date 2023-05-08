import { AppBskyFeedGetTimeline } from '@atproto/api';
// @ts-ignore
import { FeedViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { streamToArray } from '@atproto/common-web';
import { CarReader } from '@ipld/car';
import { Buffer } from 'buffer';
import { addExtension, decode, decodeMultiple } from 'cbor-x';
import cn from 'classnames';
import { useAtom } from 'jotai';
import { CID } from 'multiformats';
import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import agent from '../../Agent';
import CloseIcon from '../../assets/close.svg';
import Blue from '../../components/Blue/Blue';
import Loading from '../../components/Loading';
import PostsRenderer from '../../components/PostsRenderer';
import { UI_STORAGE_KEY, uiAtom } from '../../store/ui';
import detectLang from '../../utils/detectLang';
import styles from './Feed.module.scss';

addExtension({
    Class: CID,
    tag: 42,
    encode: () => {
        throw new Error("cannot encode cids");
    },
    decode: (bytes: any) => {
        if (bytes[0] !== 0) {
            throw new Error("invalid cid for cbor tag 42");
        }
        return CID.decode(bytes.subarray(1)); // ignore leading 0x00
    },
});;

export default function Firehose(props: {}) {
    const page = useRef<any>(null);
    const refetchRef = useRef<any>(null);
    const colRef = useRef<any>(null);
    const [newPosts, setNewPosts] = useState<Array<any>>([]);
    const [ui, setUi] = useAtom(uiAtom);

    const [feed, setFeed] = useState<any>([]);
    const [keyword, setKeyword] = useState<string>('');
    const lang = useRef('');
    const [displayLang,setDisplayLang] = useState('');

    const _handleMessage = useCallback(async (e: any) => {
        if (e.data instanceof Blob) {
            const messageBuf = await e.data.arrayBuffer();
            // @ts-ignore
            const [header, body] = decodeMultiple(new Uint8Array(messageBuf));
            if (header.op !== 1) return;
            const car = await CarReader.fromBytes(body.blocks);
            for (const op of body.ops) {
                if (!op.cid) continue;
                const block = await car.get(op.cid);
                if (!block) return;

                const record = decode(block.bytes);
                if (record.$type === "app.bsky.feed.post" && typeof record.text === "string") {
                    // Optional filter out empty posts
                    if (record.text.length > 0) {
                        const rkey = op.path.split("/").at(-1);

                        await _appendToFeed(body.repo, record, rkey);
                    }
                }
            }
        }

    }, [feed, keyword, lang]);

    const _appendToFeed = useCallback(async (repo: any, record: any, rkey: any) => {
        if (lang.current && lang.current.length) {
            const detect = await detectLang(record.text);
            if (detect != lang.current) {
                return false;
            }
        }

        const userRepo = await agent.getProfile({
            actor: repo
        }).then(d => d.data);
        const newItem = {
            author: userRepo,
            ...record,
            id: rkey,
            record: record,
        };
        // @ts-ignore
        setFeed(prev => [newItem, ...prev.splice(0, 100)]);
        return true;
    }, [feed, keyword, lang.current]);

    useEffect(() => {
        const ws = new WebSocket("wss://bsky.social/xrpc/com.atproto.sync.subscribeRepos");
        ws.addEventListener("message", _handleMessage);

        return () => {
            ws.removeEventListener("message", _handleMessage);
            ws.close();
        }
    }, []);

    const _handleClose = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setUi(prev => ({ ...prev, firehose: false }));
        localStorage.setItem(UI_STORAGE_KEY, JSON.stringify({ ...ui, firehose: false }));
    };

    return (
        <div ref={colRef} className="skyline skycol">
            <div className="col-header">
                <h1>Happening Right Now!</h1>
                <button className="icon-btn" onClick={_handleClose}>
                    <img src={CloseIcon} alt="Close" />
                </button>
            </div>
            <div className="d-flex align-items-center">
                <div className={styles.search}>
                    <div className="input-wrapper bordered">
                        <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search..." />
                    </div>
                </div>
                <div className={styles.search}>
                    <div className="input-wrapper select-wrapper bordered">
                        <select title="Language" value={displayLang} onChange={e => {
                            lang.current = (e.target.value);
                            setDisplayLang(e.target.value);
                        }}>
                            <option value="">Any</option>
                            <option value="en">English</option>
                            <option value="kr">Korean</option>
                            <option value="jp">Japanese</option>
                            <option value="ar">Persian & Arabic</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* <PostsRenderer feed={feed} /> */}
            {keyword.length ?
                feed
                    .filter((p: any) => p && p.author)
                    .filter((p: any) => p.text.toLowerCase().indexOf(keyword) > -1)
                    .map((p: any) => <Blue key={p.id} firehose post={p} />)
                : feed
                    .filter((p: any) => p && p.author)
                    .map((p: any) => <Blue key={p.id} firehose post={p} />)}
        </div>
    );
}