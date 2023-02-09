import React, {Component, useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from "./context/auth-context";
export default function ProtectedRoute() {
    const {currentUser, getCurrentUserPromise} = useAuth()
    const [isLoading, setLoading] = useState(true)
    useEffect(() => {
        getCurrentUserPromise().then(() => {
            setLoading(false)
        })

    }, [1])
    return isLoading ? <div/> : currentUser ? <Outlet/> : <Navigate to="/login"/>
};