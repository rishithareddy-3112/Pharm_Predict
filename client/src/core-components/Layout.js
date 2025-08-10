import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import withRouter from './WithRouter'
import { isAuth, signout } from '../auth-components/helpers'
import { Image } from 'react-bootstrap'
const Layout = ({ children, router }) => {
    const { location, navigate } = router
    const pathname = location.pathname
    const nav = () => {
        const isActive = (path) => {
            if (path === pathname) {
                return { backgroundColor: "skyblue", color: "black", border: "2px solid skyblue", borderRadius: "5px" }
            }
            else {
                return { color: "black" }
            }
        }
        return (
            <ul className='nav text-dark m-1'>
                <li className='nav-item'>
                    <Image src='https://dm0qx8t0i9gc9.cloudfront.net/watermarks/image/rDtN98Qoishumwih/plus-sign-in-blue-circle_G1mO_ILO_SB_PM.jpg' width={50} style={{ marginRight: '10px' }} roundedCircle />
                </li>
                <li className='nav-item'>
                    <Link to='/' className=' nav-link' style={isActive('/')}>
                        Home
                    </Link>
                </li>
                {!isAuth() && (
                    <Fragment>
                        <li className='nav-item'>
                            <Link to='/pharma/signin' className=' nav-link' style={isActive('/pharma/signin')}>
                                SignIn
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/pharma/signup' className=' nav-link' style={isActive('/pharma/signup')}>
                                SignUp
                            </Link>
                        </li>
                    </Fragment>
                )}

                {isAuth() && isAuth().role === "admin" && (
                    <li className='nav-item'>
                        <Link to="/pharma/admin" className=' nav-link' style={isActive('/pharma/admin')}>
                            {isAuth().pharmaName}
                        </Link>
                    </li>
                )}

                {isAuth() && isAuth().role === "admin" && (
                    <li className='nav-item'>
                        <Link to="/pharma/admin/add-medicine" className=' nav-link' style={isActive('/pharma/admin/add-medicines')}>
                            Add medicines
                        </Link>
                    </li>
                )}

                {isAuth() && isAuth().role === "pharma" && (
                    <li className='nav-item'>
                        <Link to="/pharma/private" className=' nav-link' style={isActive('/pharma/private')}>
                            {isAuth().pharmaName}
                        </Link>
                    </li>
                )}

                {isAuth() && (
                    <Fragment>
                        <li className='nav-item'>
                            <Link to="/pharma/display-medicine" className=' nav-link' style={isActive('/pharma/display-medicine')}>
                                View Medicines
                            </Link>
                        </li>
                        {isAuth().role==="pharma" && <li className='nav-item'>
                            <Link to="/pharma/view-cart" className=' nav-link' style={isActive('/pharma/view-cart')}>
                                View Cart
                            </Link>
                        </li>}
                        <li className='nav-item'>
                            <Link to="/pharma/analytics" className=' nav-link' style={isActive('/pharma/analytics')}>
                                View Analytics
                            </Link>
                        </li>
                        {isAuth().role==="admin" && <li className='nav-item'>
                            <Link to="/pharma/orders" className=' nav-link' style={isActive('/pharma/orders')}>View Orders</Link>
                        </li>}
                        <li className='nav-item'>
                            <span className='nav-link text-dark' style={{ cursor: 'pointer' }} onClick={() => {
                                signout(() => {
                                    navigate('/')
                                })
                            }}>SignOut</span>
                        </li>
                        
                    </Fragment>
                )}

            </ul>)
    }

    return (
        <Fragment>
            <div className='mb-3'>
                {nav()}
            </div>
            <hr />
            <div className='container'>
                {children}
            </div>
        </Fragment>
    )
}
export default withRouter(Layout)