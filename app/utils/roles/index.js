import React, { createContext, useContext, useEffect, useState } from 'react';
import { getData } from '../storage';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [roles, setRoles] = useState('User');

    useEffect(() => {
        getUser();
    }, [])

    const getUser = () => {
        getData('userProfile').then((res) => {
            setRoles(res.scope)
        });
    };

    return (
        <RoleContext.Provider value={{ roles, setRoles }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    return useContext(RoleContext);
};