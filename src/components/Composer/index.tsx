import { AppBskyActorSearchActorsTypeahead } from '@atproto/api';
import cn from 'classnames';
import { useSetAtom } from "jotai";
import { ChangeEvent, FormEvent, FormEventHandler, SyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import agent from '../../Agent';
import CloseIcon from '../../assets/close.svg';
import ImageIcon from '../../assets/image.svg';
import AvatarPlaceholder from '../../assets/placeholder.png';
import { lightboxAtom } from "../../store/lightbox";
import Record from '../Blue/Embed/Record';
import Button from "../Button";
import styles from './Composer.module.scss';

export default function Composer(props: {
    onSubmit: Function,
    submitLoading: boolean,
    quotePost?: any,
    inModal?: boolean
}) {
    const { onSubmit, submitLoading, quotePost, inModal } = props;
    const setLightbox = useSetAtom(lightboxAtom);
    const [fileUploadLoading, setFileUploadLoading] = useState(false);
    const [files, setFiles] = useState<{
        file: File | null,
        preview: any
    }[]>([]);
    const [text, setText] = useState('');
    const textareaRef = useRef<any>(null);
    const [autoComplete, setAutoComplete] = useState<any>({
        coordinates: {
            x: 0,
            y: 0,
        },
        term: '',
        show: false,
        data: null,
        loading: false,
        index: 0,
        fetch: false
    });
    const autoCompleteRef = useRef<HTMLElement>(null);
    const lastPos = useRef<any>(null);
    const typeAheadTimeoutRef = useRef<any>(null);
    const [isFocus, setIsFocus] = useState(false);

    const _handlePublished = () => {
        setFiles([]);
        setText('');
        textareaRef.current.textContent = '';
    };

    useEffect(() => {
        window.addEventListener('publish-post', _handlePublished);

        return () => {
            window.removeEventListener('publish-post', _handlePublished);
        }
    }, []);

    const _handleKeyUp = useCallback((e: KeyboardEvent) => {
        const selection = window.getSelection();

        if (selection) {
            const pos = selection.anchorOffset;
            const currentChar = text.charAt(pos - 1);

            if (currentChar == '@') {
                lastPos.current = pos;
                let range = selection.getRangeAt(0),
                    rect = range.getClientRects()[0];

                // @ts-ignore
                autoCompleteRef.current.animate({
                    top: rect.y + 20 + 'px',
                    left: rect.x + 'px'
                }, {
                    duration: 100,
                    fill: "forwards",
                    easing: "ease-out"
                });
                setAutoComplete((prev: any) => ({ ...prev, fetch: true }));
            } else if (pos < lastPos.current && autoComplete.show) {
                setAutoComplete((prev: any) => ({ ...prev, fetch: false, show: false }));
            }
        }
    }, [autoComplete, autoCompleteRef.current, text, lastPos.current, typeAheadTimeoutRef.current]);

    function SetCaretPosition(el: any, pos: number) {

        // Loop through all child nodes
        for (var node of el.childNodes) {
            if (node.nodeType == 3) { // we have a text node
                if (node.length >= pos) {
                    // finally add our range
                    var range = document.createRange(),
                        sel = window.getSelection();
                    range.setStart(node, pos);
                    range.collapse(true);
                    sel?.removeAllRanges();
                    sel?.addRange(range);
                    return -1; // we are done
                } else {
                    pos -= node.length;
                }
            } else {
                pos = SetCaretPosition(node, pos);
                if (pos == -1) {
                    return -1; // no need to finish the for loop
                }
            }
        }
        return pos; // needed because of recursion stuff
    }

    const _handleMention = useCallback((e: SyntheticEvent | null, user: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        let currentText = textareaRef.current.innerText;
        let nextSpacePos = currentText.substring(lastPos.current, currentText.length).indexOf(' ');
        if (nextSpacePos <= -1) {
            nextSpacePos = currentText.length;
        } else {
            nextSpacePos += lastPos.current;
        }
        let newText = '';
        newText += currentText.substring(0, lastPos.current) + `${user.handle}` + '\u00a0' + currentText.substring(nextSpacePos, currentText.length);
        setText(newText);
        textareaRef.current.textContent = newText;
        if (e) {
            textareaRef.current.focus();
        }
        SetCaretPosition(textareaRef.current, Math.min((lastPos.current + user.handle.length + 1), newText.length));
        setAutoComplete((prev: any) => ({ ...prev, show: false }));
    }, [lastPos.current, text, textareaRef.current])

    const _fetchTypeAhead = useCallback(async () => {
        if (!autoComplete.fetch) return;
        const text = textareaRef.current.innerText;
        let nextSpacePos = text.substring(lastPos.current, text.length).indexOf(' ');

        const term = text.substring(lastPos.current, nextSpacePos > -1 ? nextSpacePos + lastPos.current : text.length);
        const typeAhead = await agent.searchActorsTypeahead({
            term: term
        });
        setAutoComplete((prev: any) => ({ ...prev, data: typeAhead.data.actors.slice(0, 10), term: '', show: true, index: 0 }));
    }, [typeAheadTimeoutRef.current, lastPos.current, text, autoComplete]);

    const _handleTextarea = (e: any) => {
        setText(e.currentTarget.textContent.substring(0, 300));
        clearTimeout(typeAheadTimeoutRef.current);
        typeAheadTimeoutRef.current = setTimeout(() => {
            _fetchTypeAhead();
        }, 500);
    };

    const _handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if ((!text.length && !files.length) || fileUploadLoading || submitLoading) return;
        const filesData = await _handleFilesUpload();

        onSubmit(filesData, text);
    }

    const _handleFilesUpload = async () => {
        setFileUploadLoading(true);
        const results = await Promise.all(
            files.map(f => _handleFileUpload(f))
        )
        setFileUploadLoading(false);
        return results;
    };

    const _handleFileUpload = async (file: { file: File | null, preview: any }) => {
        const buffer = await file?.file?.arrayBuffer();
        const result = await agent.uploadBlob(buffer as any, {
            encoding: file?.file?.type!
        });
        return result;
    }

    const _handleCtrlEnter = (e: any) => {
        if (e.ctrlKey && e.keyCode == 13) {
            _handleSubmit(e);
        } else {
            _handleKeyUp(e);
        }
    };

    const _handleKeyDown = useCallback((e: any) => {
        if (e.code == 'Space' && autoComplete.show) {
            return setAutoComplete((prev: any) => ({
                ...prev,
                fetch: false,
                show: false
            }))
        }
        if (e.ctrlKey && e.keyCode == 13) {
            return;
        }
        if (e.code.toLocaleLowerCase() == 'enter' && autoComplete.show) {
            e.preventDefault();
            e.stopPropagation();
            _handleMention(null, autoComplete.data[autoComplete.index]);
            return false;
        }
        if (autoComplete.show && (e.code.toLocaleLowerCase() == 'arrowup')) {
            e.preventDefault();
            setAutoComplete((prev: any) => ({ ...prev, index: Math.max(0, prev.index - 1) }));
            return false;
        }
        if (autoComplete.show && (e.code.toLocaleLowerCase() == 'arrowdown')) {
            e.preventDefault();
            setAutoComplete((prev: any) => ({ ...prev, index: Math.min(prev.data.length - 1, prev.index + 1) }));
            return false;
        }
    }, [autoComplete]);

    const _handleFile = async (e: any, file?: null) => {
        const selectedFiles = file ? [file] : e.target.files;
        let filesArray: any[] = Array.from(selectedFiles);
        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            filesArray[i] = { file: file, preview: URL.createObjectURL(file as Blob) };
        }
        setFiles(prev => {
            if (prev.length + selectedFiles.length <= 4) {
                return [...prev, ...filesArray]
            }
            return prev;
        });
    };

    const _handleRemoveFile = (e: any, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        let newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    useEffect(() => {
        if (textareaRef.current && inModal) {
            textareaRef.current.focus();
        }
    }, [textareaRef.current, inModal]);

    const _handlePasteImage = (e: any) => {
        var items = (e.clipboardData || e.originalEvent.clipboardData).items;

        for (var index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                e.preventDefault();
                e.stopPropagation();
                var blob = item.getAsFile();
                _handleFile(null, blob);
                return false;
            }
        }
    };

    useEffect(() => {
        if (isFocus) {
            document.addEventListener('paste', _handlePasteImage);
        } else {
            document.removeEventListener('paste', _handlePasteImage);
        }

        return () => {
            document.removeEventListener('paste', _handlePasteImage);
        }
    }, [isFocus]);

    return (
        <>
            <form onSubmit={_handleSubmit}>
                {/* <textarea
                    dir="auto"
                    // className={}
                    placeholder="What's on your mind?"
                    onKeyDown={_handleCtrlEnter}
                    onChange={_handleTextarea}
                    value={text}></textarea> */}
                <div
                    className={cn(styles.textInput, { [styles.open]: text.length })}
                    spellCheck="false"
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onKeyDown={_handleKeyDown}
                    onKeyUp={_handleCtrlEnter}
                    dir="auto"
                    ref={ref => textareaRef.current = ref}
                    placeholder="What's on your mind?"
                    onInput={_handleTextarea}
                ></div>
                {quotePost ? <Record isQuote embed={quotePost as any} uri={quotePost.uri as string} author={quotePost.author as any} /> : ''}
                {files.length ?
                    <div className={styles.files}>
                        {files.map((file, index) =>
                            <div className={styles.file} onClick={() => setLightbox({ images: [file.preview], show: true })} key={index}>
                                <span className={styles.fileRemove} onClick={(e) => _handleRemoveFile(e, index)}>
                                    <img src={CloseIcon} alt="" />
                                </span>
                                <img src={file.preview} alt="" />
                            </div>
                        )}
                    </div>
                    : ''}
                <div className={styles.footer}>
                    <div>
                        {text.length ? <span>{text.length}/300</span> : ''}
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="file-input">
                            <input multiple type='file' accept='image/jpeg,image/png' onChange={_handleFile} title="Upload Media" />
                            <label>
                                <img src={ImageIcon} height="28" alt="" />
                            </label>
                        </div>
                        <Button type="submit" loading={submitLoading || fileUploadLoading} className="btn primary" text='Post' />
                    </div>
                </div>
            </form>
            <div
                ref={ref =>
                    // @ts-ignore
                    autoCompleteRef.current = ref}
                className={cn(styles.autoComplete, { [styles.autocompleteOpen]: autoComplete.show, [styles.autocompleteFixed]: inModal })}>
                <ul>
                    {(autoComplete.data)?.map((user: any, index: number) => <li className={cn({ [styles.active]: index == autoComplete.index })} onClick={(e) => _handleMention(e, user)} key={user.did}>
                        <div>
                            <img src={user.avatar || AvatarPlaceholder} alt="" />
                        </div>
                        <div>
                            <strong>@{user.handle}</strong>
                        </div>
                    </li>)}
                </ul>
            </div >
        </>
    );
}