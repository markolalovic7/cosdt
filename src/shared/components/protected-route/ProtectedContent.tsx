import React from 'react';
import { useRecoilValue } from 'recoil';
import { checkPermission } from '../../../core/Utils';
import { UserPermissionEnum } from '../../../model/domain/enums/UserPermissionEnum';

import { UserProfileAtom } from '../../recoil/UserProfileAtom';

interface ProtectedContentProps {
    permission: UserPermissionEnum;
    children: React.ReactNode;
}

function ProtectedContent({ children, permission }: ProtectedContentProps) {
    const profile = useRecoilValue(UserProfileAtom);
    let hasPermission = checkPermission(permission, profile?.roles);

    return (
        <React.Fragment>
            {hasPermission && children ? children : ''}
        </React.Fragment>
    );
}

export default ProtectedContent;