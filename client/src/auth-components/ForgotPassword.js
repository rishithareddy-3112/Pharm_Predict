import React, { useState } from "react";
import Layout from "../core-components/Layout";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { CDBAlert, CDBBtn } from "cdbreact";
import 'react-toastify/dist/ReactToastify.min.css'

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: "",
        buttonText: "Request password reset link"
    })

    const { email, buttonText } = values

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/forgot-password`,
            data: { email }
        })
            .then(response => {
                
                toast.success(response.data.message)
                setValues({ ...values, buttonText: 'Requested' })
            })
            
            .catch(error => {
                console.log(error)
                
                setValues({ ...values, buttonText: 'Request password reset link' })
                toast.error(error.response.data.error)
            })
    }

    const passwordForgotForm = () => {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
                </div>
                <br />
                <div>
                    {/* <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button> */}
                    <CDBBtn outline color="dark" type="submit" onClick={clickSubmit}>
                        {buttonText}
                    </CDBBtn>
                    
                </div>
            </form>
        )
    }
    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                <p className="lead p-5 text-center">Enter you mail id</p>
                {passwordForgotForm()}
            </div>
        </Layout>
    )
}
export default ForgotPassword;