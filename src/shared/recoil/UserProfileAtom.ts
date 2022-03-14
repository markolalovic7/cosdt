import { atom } from 'recoil';
import { UserProfile } from '../../model/domain/classes/UserProfile';

export const UserProfileAtom = atom<UserProfile | undefined>({
    key: "UserProfileAtom",
    default: undefined
});