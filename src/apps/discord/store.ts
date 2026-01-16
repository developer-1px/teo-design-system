/**
 * Discord App State Management (Jotai)
 */

import {atom} from "jotai"

export const selectedServerIdAtom = atom<string | null>("1");
export const selectedChannelIdAtom = atom<string | null>("1-1");
export const showMemberListAtom = atom<boolean>(true);
