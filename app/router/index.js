import React from 'react';
import { RoleProvider } from '../utils/roles';
import RoleBasedNavigator from './roleBasedNavigator';

const Router = () => {
    return (
        <RoleProvider>
            <RoleBasedNavigator />
        </RoleProvider>
    )
}

export default Router;
