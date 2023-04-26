import { AppBskyActorDefs, AppBskyActorProfile } from 'atproto/packages/api';
import { atom } from 'jotai';

export const userAtom = atom<AppBskyActorDefs.ProfileView | null>(null);