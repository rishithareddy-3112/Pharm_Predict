import React, { useState } from "react";
import Layout from "../core-components/Layout";
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { authenticate, isAuth } from "./helpers";
import withRouter from "../core-components/WithRouter";
import { CDBInput, CDBCard, CDBCardBody, CDBBtn, CDBLink, CDBContainer, CDBRow, CDBCol } from 'cdbreact';

const Signin = ({ router }) => {
    const { navigate } = router
    const [values, setValues] = useState({
        email: "",
        password: "",
        buttonText: "Submit"
    })

    const { email, password, buttonText } = values

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        axios({ //insted of postman
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            data: { email, password }
        })
            .then(response => {
                //save the response {user, token} in localStorage/ cookie
                toast.success(response.data.message)
                authenticate(response, () => {
                    setValues({ ...values, email: '', password: '', buttonText: 'Submitted' })
                    if (isAuth() && isAuth().role === "admin") {
                        navigate('../pharma/admin')
                    } else {
                        navigate('../pharma/private')
                    }
                })
            })
            .catch(error => {
                // console.log('SIGNUP ERROR', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const signinForm = () => {
        return (
            <CDBContainer>
                <div className="d-flex justify-content-center align-items-center">
                    <CDBCard style={{ width: '30em', backgroundColor: 'white' }}>
                        <div style={{ background: 'skyblue' }} className="text-center text-black">
                            <p className="h5 mt-2 py-4 font-weight-bold">Sign In</p>
                        </div>
                        <CDBCardBody className="mx-4">
                            <CDBInput hint="E-mail" label="Email" type="email" onChange={handleChange('email')} value={email} />
                            <CDBInput hint="Password" label="Password" type="password" onChange={handleChange('password')} value={password} />
                            <div className="mt-5 d-flex flex-column gap-2 justify-content-center align-items-center">
                                <CDBBtn outline color="dark" type="submit" onClick={clickSubmit}>
                                    {buttonText}
                                </CDBBtn>

                                <CDBLink to="/auth/password/forgot" className="ms-auto text-danger" >Forgot Password ?</CDBLink>
                            </div>

                        </CDBCardBody>
                    </CDBCard>
                </div>
            </CDBContainer>
        )
    }
    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {isAuth() ? <Navigate to="/" /> : null}
                {signinForm()}
                <br />

            </div>
        </Layout>
    )
}
export default withRouter(Signin);