import { Record } from '@atproto/api/src/client/types/app/bsky/feed/post';
import { atom } from 'jotai';

export const newAtom = atom<{
    show: boolean,
    cid?: string | null,
    post?: Record | null,
    quotePost?: Record | null
}>({
    show: false,
    cid: null,
    post: null,
    quotePost: null
});