import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { checkPermission } from '../../../core/Utils';
import { UserPermissionEnum } from '../../../model/domain/enums/UserPermissionEnum';

import { UserProfileAtom } from '../../recoil/UserProfileAtom';

interface ProtectedRouteProps {
    permission: UserPermissionEnum;
}

function ProtectedRoute({ children, permission, ...rest }: RouteProps & ProtectedRouteProps) {
    //const profile = useRecoilValue(UserProfileAtom);
    let hasPermission = true; //checkPermission(permission, profile?.roles) ;

    if (hasPermission) {
        return (
            <Route {...rest}>
                {children}
            </Route>
        )
    }
    else {
        return <Redirect to={{ pathname: '/' }} />
    }
}

export default ProtectedRoute;