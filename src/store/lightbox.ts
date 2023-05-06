import { atom } from 'jotai';

export const lightboxAtom = atom<{
    show: boolean,
    images: Array<any>,
    isFleet?: boolean,
    meta?: any
}>({
    show: false,
    images: [],
    isFleet: false,
    meta: null
});