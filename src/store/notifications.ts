import { Notification } from '@atproto/api/src/client/types/app/bsky/notification/listNotifications';
import { atom } from 'jotai';

export const notificationsAtom = atom<Notification[]>([]);