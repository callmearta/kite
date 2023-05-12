import { RichText } from '@atproto/api';
import { Document } from '@tiptap/extension-document';
import Hardbreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import { Link } from '@tiptap/extension-link';
import { Mention } from '@tiptap/extension-mention';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Text } from '@tiptap/extension-text';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
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
import Wave from '../Wave';
import Audio from './Audio';
import styles from './Composer.module.scss';


export default function Composer(props: {
    onSubmit: Function,
    submitLoading: boolean,
    quotePost?: any,
    inModal?: boolean
}) {
    const { onSubmit, submitLoading, quotePost, inModal } = props;
    const setLightbox = useSetAtom(lightboxAtom);
    const [audio, setAudio] = useState(null);
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
    const [richtext, setRichText] = useState(new RichText({ text: '' }));

    const editor = useEditor({
        extensions: [
            Document,
            Link.configure({
                protocols: ['http', 'https'],
                autolink: true,
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: styles.mention,
                },
                suggestion: {
                    items: async (props) => {
                        const typeAhead = await agent.searchActorsTypeahead({
                            term: props.query
                        });
                        setAutoComplete((prev: any) => ({ ...prev, data: typeAhead.data.actors.slice(0, 10), show: true, index: 0 }));
                        return typeAhead.data.actors.slice(0, 10)
                    },
                    char: '@',
                    render: () => {
                        return {
                            onStart: (props) => {
                                if (!props.clientRect) return;

                                const rect = props.clientRect();

                                autoCompleteRef.current?.animate({
                                    top: rect?.y! + 20 + 'px',
                                    left: rect?.x! + 'px'
                                }, {
                                    duration: 100,
                                    fill: "forwards",
                                    easing: "ease-out"
                                });

                                setAutoComplete((prev: any) => ({ ...prev, data: props.items, show: true, props }));
                            },
                            onKeyDown: (props) => {
                                if (props.event.key === 'Escape') {
                                    setAutoComplete({ show: false });
                                    return true;
                                }
                                return _handleArrows(props) || false;
                            },
                            onUpdate: props => {
                                if (!props.clientRect) {
                                    setAutoComplete((prev: any) => ({ ...prev, show: false }));
                                    return;
                                };
                                const rect = props.clientRect();

                                autoCompleteRef.current?.animate({
                                    top: rect?.y! + 20 + 'px',
                                    left: rect?.x! + 'px'
                                }, {
                                    duration: 100,
                                    fill: "forwards",
                                    easing: "ease-out"
                                });
                                setAutoComplete((prev: any) => ({ ...prev, data: props.items, show: true, props }));
                            },
                            onExit: () => {
                                setAutoComplete((prev: any) => ({ ...prev, show: false }));
                            }
                        };
                    }
                }
                // suggestion: createSuggestion({autocompleteView}),
            }),
            Paragraph,
            Placeholder.configure({
                // placeholder,
                placeholder: "What's on your mind?"
            }),
            Text,
            History,
            Hardbreak,
        ],
        editorProps: {
            //   attributes: {
            //     class: modeClass,
            //   },
            handlePaste: (_, event) => {
                const items = event.clipboardData?.items

                if (items === undefined) {
                    return
                }
                _handlePasteImage(event);
            },
            handleKeyDown: (_, event) => {
                if ((event.metaKey || event.ctrlKey) && event.code === 'Enter') {
                    // Workaround relying on previous state from `setRichText` to
                    // get the updated text content during editor initialization
                    setRichText((state: RichText) => {
                        // onPressPublish(state)
                        _handleSubmit(null, state);
                        return state
                    })
                    return true;
                }
            },
        },
        content: richtext.text.toString(),
        autofocus: inModal ? true : false,
        editable: true,
        injectCSS: true,
        onUpdate({ editor: editorProp }) {
            const json = editorProp.getJSON()
            const newRt = new RichText({ text: editorJsonToText(json).trim() })
            setRichText(newRt)

            const newSuggestedLinks = new Set(editorJsonToLinks(json))
            //   if (!isEqual(newSuggestedLinks, suggestedLinks)) {
            //     onSuggestedLinksChanged(newSuggestedLinks)
            //   }
        },
    });

    const _handlePublished = () => {
        setFiles([]);
        setText('');
        setRichText((prev: any) => ({ ...prev, text: '' }));
        setAudio(null);
        _clearEditor();
        // textareaRef.current.textContent = '';
    };

    const _clearEditor = useCallback(() => {
        editor?.commands.clearContent(true);
    }, [editor]);


    useEffect(() => {
        window.addEventListener('publish-post', _handlePublished);

        return () => {
            window.removeEventListener('publish-post', _handlePublished);
        }
    }, [editor]);

    const _handleKeyUp = useCallback((e: KeyboardEvent) => {
        const selection = window.getSelection();

        if (selection) {
            const pos = selection.anchorOffset;
            const currentChar = text.charAt(pos - 1);

            if (currentChar == '@' || e.which == 50) {
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
                setTimeout(() => {
                    _fetchTypeAhead();
                }, 10);
            } else if (pos < lastPos.current && autoComplete.show) {
                setAutoComplete((prev: any) => ({ ...prev, fetch: false, show: false }));
            }
        }
    }, [autoComplete, autoCompleteRef.current, text, lastPos.current, typeAheadTimeoutRef.current, window.getSelection()]);

    function SetCaretPosition(el: any, pos: number) {

        // Loop through all child nodes
        // for (var node of el.childNodes) {
        //     if (node.nodeType == 3) { // we have a text node
        if (el.length >= pos) {
            // finally add our range
            var range = document.createRange(),
                sel = window.getSelection();
            range.setStart(el, pos);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
            return -1; // we are done
        } else {
            pos -= el.length;
        }
        // } else {
        //     pos = SetCaretPosition(el, pos);
        //     if (pos == -1) {
        //         return -1; // no need to finish the for loop
        //     }
        //     }
        // }
        return pos; // needed because of recursion stuff
    }

    const _handleMention = useCallback((e: SyntheticEvent | null, user: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        autoComplete.props.command({ id: user.handle });
        // const selection = window.getSelection();


        // let currentText = selection?.focusNode?.textContent!;
        // let nextSpacePos = currentText.substring(lastPos.current, currentText.length).indexOf(' ');
        // if (nextSpacePos <= -1) {
        //     nextSpacePos = currentText.length;
        // } else {
        //     nextSpacePos += lastPos.current;
        // }
        // let newText = '';
        // newText += currentText.substring(0, lastPos.current) + `${user.handle}` + ' ' + currentText.substring(nextSpacePos, currentText.length);
        // setText(newText);
        // if (selection && selection.focusNode) {
        //     selection.focusNode.textContent = newText;
        // }
        // // textareaRef.current.textContent = newText;
        // if (e) {
        //     textareaRef.current.focus();
        // }
        // SetCaretPosition(selection?.focusNode, Math.min((lastPos.current + user.handle.length + 1), newText.length));
        // setAutoComplete((prev: any) => ({ ...prev, show: false, fetch: false, data: null }));
    }, [lastPos.current, text, textareaRef.current, autoComplete.props, window.getSelection()])

    const _fetchTypeAhead = useCallback(async () => {

        if (!autoComplete.fetch) return;
        const selection = window.getSelection();
        const text = selection?.focusNode?.textContent!;
        let nextSpacePos = text.substring(lastPos.current, text.length).indexOf(' ');

        const term = text.substring(lastPos.current, nextSpacePos > -1 ? nextSpacePos + lastPos.current : text.length);
        const typeAhead = await agent.searchActorsTypeahead({
            term: term
        });
        setAutoComplete((prev: any) => ({ ...prev, data: typeAhead.data.actors.slice(0, 10), show: true, index: 0 }));
    }, [typeAheadTimeoutRef.current, lastPos.current, text, autoComplete, window.getSelection()]);

    const _handleTextarea = (e: any) => {
        setText(e.currentTarget.textContent.substring(0, 300));
        clearTimeout(typeAheadTimeoutRef.current);
        typeAheadTimeoutRef.current = setTimeout(() => {
            _fetchTypeAhead();
        }, 500);
    };

    const _handleSubmit = useCallback(async (e: FormEvent | any, rt: any = null) => {
        if (e)
            e.preventDefault();

        const filesData: any[] = await _handleFilesUpload();
        if (!rt && !audio && ((!richtext.text.length && !filesData.length) || fileUploadLoading || submitLoading || richtext.graphemeLength > 300)) return;
        if (rt && !audio && ((!rt.text.length && !filesData.length) || fileUploadLoading || submitLoading || rt.graphemeLength > 300)) return;

        onSubmit(filesData, rt ? rt.text : richtext.text, audio);
    }, [richtext, audio, files])

    const _handleFilesUpload = useCallback((): Promise<any[]> => {
        return new Promise(async (resolve, reject) => {
            // @ts-ignore
            setFiles(async (files) => {
                setFileUploadLoading(true);
                const results = await Promise.all(
                    files.map(f => _handleFileUpload(f))
                )
                setFileUploadLoading(false);
                resolve(results);
                return files;
            });
        });
    }, [files, fileUploadLoading]);

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

    const _handleArrows = (props: any) => {
        if ((props.event.code.toLocaleLowerCase() == 'arrowup')) {
            setAutoComplete((prev: any) => ({ ...prev, index: Math.max(0, prev.index - 1) }));
            return true;
        }
        if ((props.event.code.toLocaleLowerCase() == 'arrowdown')) {
            setAutoComplete((prev: any) => ({ ...prev, index: Math.min(prev.data.length - 1, prev.index + 1) }));
            return true;
        }
        if (props.event.code.toLocaleLowerCase() == 'enter') {
            setAutoComplete((prev: any) => {
                prev.props.command({ id: prev.data[prev.index].handle });
                return { ...prev, index: 0, show: false }
            });
            return true;
        }

        return false;
    }

    function editorJsonToText(json: JSONContent): string {
        let text = ''
        if (json.type === 'doc' || json.type === 'paragraph') {
            if (json.content?.length) {
                for (const node of json.content) {
                    text += editorJsonToText(node)
                }
            }
            text += '\n'
        } else if (json.type === 'text') {
            text += json.text || ''
        } else if (json.type === 'mention') {
            text += `@${json.attrs?.id || ''}`
        }
        return text
    }

    function editorJsonToLinks(json: JSONContent): string[] {
        let links: string[] = []
        if (json.content?.length) {
            for (const node of json.content) {
                links = links.concat(editorJsonToLinks(node))
            }
        }

        const link = json.marks?.find(m => m.type === 'link')
        if (link?.attrs?.href) {
            links.push(link.attrs.href)
        }

        return links
    }

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
                {/* <div
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
                ></div> */}
                <EditorContent editor={editor} className={cn(styles.textInput, { [styles.open]: richtext.text.length })} />
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
                {audio ? <Wave onRemove={() => setAudio(null)} audioUrl={audio} /> : ''}
                <div className={styles.footer}>
                    <div>
                        {richtext.text.length ? <span className={cn({ "span-error": richtext.graphemeLength > 300 })}>{richtext.graphemeLength}/300</span> : ''}
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="file-input">
                            <input multiple type='file' accept='image/jpeg,image/png' onChange={_handleFile} title="Upload Media" />
                            <label>
                                <img src={ImageIcon} height="28" alt="" />
                            </label>
                        </div>
                        <Audio setAudio={setAudio} />
                        <Button type="submit" loading={submitLoading || fileUploadLoading} className={cn("btn primary", { disabled: richtext.graphemeLength > 300 })} text='Post' />
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