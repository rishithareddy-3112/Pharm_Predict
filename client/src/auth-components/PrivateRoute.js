import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuth } from './helpers'

const PrivateRoute = ({ children }) => {
    
    if (!isAuth()) {
        return <Navigate to="/pharma/signin" />
    }
    return children;
}
export default PrivateRoute