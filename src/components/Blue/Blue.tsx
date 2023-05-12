import { AppBskyActorProfile, AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, ProfileRecord } from "@atproto/api";
import { FeedViewPost, PostView, ReasonRepost, isReasonRepost } from "@atproto/api/src/client/types/app/bsky/feed/defs";
import { ReasonType } from "@atproto/api/src/client/types/com/atproto/moderation/defs";
import cn from 'classnames';
import { useAtomValue } from "jotai";
import Markdown from 'markdown-to-jsx';
import React, { SyntheticEvent, useEffect, useReducer, useRef, useState } from "react";
import { renderToString } from 'react-dom/server';
import { Link, useNavigate } from "react-router-dom";
import PinIcon from '../../assets/pin.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import RepostIcon from '../../assets/repost-fill.svg';
import { userAtom } from "../../store/user";
import convertURIToBinary from "../../utils/convertURIToBinary";
import fromNow from '../../utils/fromNow';
import linkFromPost from "../../utils/linkFromPost";
import renderMarkdown from "../../utils/renderMarkdown";
import Wave from "../Wave";
import styles from './Blue.module.scss';
import Comments from "./Comments";
import External from "./Embed/External";
import Image from "./Embed/Image";
import Record from "./Embed/Record";
import Like from "./Like";
import More from "./More";
import Repost from "./Repost";
import Stats from "./Stats";


export default function Blue(props: {
    post: FeedViewPost | PostView,
    isReply?: boolean,
    isParent?: boolean,
    isSingle?: boolean,
    reason?: ReasonType | any,
    className?: string,
    isCompose?: boolean,
    firehose?: boolean,
    isPin?: boolean
}) {
    const { post, isReply, isParent, isSingle, reason, className, isCompose, firehose, isPin } = props;
    const elementRef = useRef<any>(null);
    const [audio, setAudio] = useState<any>(null);
    const [deleted, setDeleted] = useState(false);
    if (!post) return <div ref={elementRef} className={cn(styles.blue, styles.deleted, className, { [styles.isReply]: isReply, [styles.parent]: isParent, [styles.single]: isSingle })}>
        <p>This Post Is Deleted</p>
    </div>;

    const navigate = useNavigate();
    const embed = post?.embed as AppBskyEmbedImages.View | AppBskyEmbedExternal.View | AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View;
    const author = post?.author as AppBskyActorProfile.Record;
    const user = useAtomValue(userAtom);

    const [markdown, setMarkdown] = useState<any>([]);
    const markdownText = () => {
        if ((post.record as any)?.kiteText) {
            const res = renderMarkdown((post?.record as any)?.kiteText);
            setMarkdown(res);
        } else {
            const res = renderMarkdown((post?.record as any)?.text);
            setMarkdown(res);
        }
    };

    const _handleSingleScroll = () => {
        if (!isSingle) return;
        (elementRef.current as HTMLElement).scrollIntoView({
            behavior: 'auto',
            inline: 'start'
        });
    };

    useEffect(() => {
        markdownText();
        _handleSingleScroll();
    }, []);

    const _linkToUserProfile = (e: SyntheticEvent | any) => {
        e.preventDefault();
        e.stopPropagation();
        const userLink = `/user/${(post.author as any).handle}`;
        if (e.ctrlKey || e.button == 1) {
            window.open('/#' + userLink, "_blank");
        } else {
            navigate(userLink);
        }
    };

    const _handleClick = (e: any, isMouseDown: any = null) => {
        if (e.button == 0 && e.target != elementRef.current && isMouseDown) return;
        if (firehose) {
            if (e.ctrlKey || e.button == 1) {
                return window.open(`/#/blue/${(post.author as any).handle}/${post.id}`, "_blank");
            } else {
                return navigate(`/blue/${(post.author as any).handle}/${post.id}`);
            }
        }

        if (e.target.tagName != 'A' && e.target.tagName != 'IMG') {
            if (isSingle) {
                return e.preventDefault();
            }
            if (e.ctrlKey || e.button == 1) {
                window.open('/#' + linkFromPost(post), "_blank");
            } else {
                navigate(linkFromPost(post));
            }
        }
    };
    

    useEffect(() => {
        if (!(post.record as any)?.kiteAudio) return;
        let binary = convertURIToBinary((post.record as any)?.kiteAudio);
        let blob = new Blob([binary], {
            type: 'audio/ogg'
        });
        let blobUrl = URL.createObjectURL(blob);
        setAudio(blobUrl);
    }, [(post.record as any)?.kiteAudio]);

    return (
        deleted ? null :
            !post ? <p>Not Found</p> : <>
                <div ref={elementRef} className={cn(styles.blue, className, { [styles.isReply]: isReply, [styles.parent]: isParent, [styles.single]: isSingle, [styles.firehose]: firehose })} onClick={_handleClick} onMouseDown={e => _handleClick(e, true)}>
                    {reason ? <div className={styles.reasonRepost}>
                        <div>
                            <img src={RepostIcon} alt="Repost" />
                            Reposted By {(reason as ReasonRepost).by.displayName}
                        </div>
                    </div>
                        : ''}
                    {isPin ?
                        <div className={styles.pin}>
                            <img src={PinIcon} alt="Pin" />
                            <span>Pinned Post</span>
                        </div>
                        : ''}
                    <div className={styles.avatar} onClick={_linkToUserProfile} onMouseDown={_linkToUserProfile}>
                        <img src={author.avatar || AvatarPlaceholder as any} />
                    </div>
                    <div className={styles.body}>
                        <div className={styles.header}>
                            <div>
                                <strong onClick={_linkToUserProfile}>{author.displayName}</strong>
                                <span onClick={_linkToUserProfile}>@{(author.handle as string)}</span>
                            </div>
                            {post.indexedAt ? <span>{fromNow(new Date((post.indexedAt as string)))}</span> : ''}
                        </div>
                        <div dir="auto" style={{ whiteSpace: 'pre-wrap' }}>
                            {/* <p dir="auto"> */}
                            {markdown ?
                                [...markdown.map((i: any, index: number) => <React.Fragment key={index}>{i}</React.Fragment>)]
                                : <p>{(post?.record as any)?.text}</p>}
                        </div>
                        {audio ? <Wave audioUrl={audio} /> : ''}
                        {/* </p> */}
                        {isCompose || firehose ? '' :
                            <>
                                {embed ? <div>
                                    {embed.external ? <External embed={(embed as AppBskyEmbedExternal.View)} /> : ''}
                                    {embed.images ? <Image embed={(embed as AppBskyEmbedImages.View)} /> : ''}
                                    {embed.media ? <Image embed={(embed as AppBskyEmbedImages.View)} /> : ''}
                                    {embed.record ? <Record embed={(embed as AppBskyEmbedRecord.View)} /> : ''}
                                </div> : ''}
                                {isSingle ?
                                    <Stats post={post} />
                                    : ''}
                                <div className={styles.footer}>
                                    <Comments post={post} />
                                    <Repost post={post} />
                                    <Like post={post} />
                                    <More isPin={isPin} post={post} setDeleted={setDeleted} />
                                </div>
                            </>
                        }
                    </div>
                </div >
            </>
    );
}