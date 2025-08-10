import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuth } from './helpers'

const AdminRoute = ({ children }) => {
    
    if (!isAuth() || isAuth().role!=="admin") {
        return <Navigate to="/pharma/signin" />
    }
    return children;
}
export default AdminRoute