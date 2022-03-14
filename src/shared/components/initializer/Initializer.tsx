import { useEffect } from "react";
import { useSetRecoilState } from 'recoil';

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { UserProfileAtom } from "../../recoil/UserProfileAtom";

function Initializer() {
    const setProfile = useSetRecoilState(UserProfileAtom);

    useEffect(() => {
        loadUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadUserProfile() {
        try {
            let profile = await api.userProfile.getUserProfile();
            setProfile(profile);
              } catch (e) {
                Logger.error(e);
        }
    }

    return null;
}

export default Initializer;
