import { atom } from 'jotai';

export const SETTINGS_STORAGE_KEY = 'settings';

export const getSettings = () => {
    const settings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (settings) {
        return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY)!);
    }
    else {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({}));
        return null;
    }
};

export const setSettingsLocalStorage = (data: Object | {
    suggested: 'global' | 'personalized'
}) => {
    return localStorage.setItem(SETTINGS_STORAGE_KEY,JSON.stringify(data));
};

export const settingsAtom = atom({
    suggested: getSettings()?.suggested || 'global',
    blacklist: getSettings()?.blacklist || []
});