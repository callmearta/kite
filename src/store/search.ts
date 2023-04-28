import { atom } from 'jotai';

export const searchAtom = atom<{
    text: string,
    loading: boolean,
    show: boolean
}>({
    text: '',
    loading: false,
    show:false
});