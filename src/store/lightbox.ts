import { atom } from 'jotai';

export const lightboxAtom = atom<{
    show: boolean,
    images: Array<any>
}>({
    show:false,
    images: []
});