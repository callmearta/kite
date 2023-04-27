import { atom } from 'jotai';

export const SuggestedAtom = atom<{
    data: Array<any>,
    filteredList: any[],
    loading: boolean
}>({
    data: [],
    filteredList: [],
    loading: true
});