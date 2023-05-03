import { atom } from 'jotai';

export const UI_STORAGE_KEY = 'hot';

export const uiAtom = atom({
    hot: localStorage.getItem(UI_STORAGE_KEY) ? JSON.parse(localStorage.getItem(UI_STORAGE_KEY) as string).hot : true,
    firehose: localStorage.getItem(UI_STORAGE_KEY) ? JSON.parse(localStorage.getItem(UI_STORAGE_KEY) as string).hot : true,
    theme: localStorage.getItem(UI_STORAGE_KEY) ? JSON.parse(localStorage.getItem(UI_STORAGE_KEY) as string).theme : true,
});