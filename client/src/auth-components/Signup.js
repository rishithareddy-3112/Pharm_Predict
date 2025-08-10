import React, { useState } from "react";
import { Navigate } from "react-router-dom"
import Layout from "../core-components/Layout";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { CDBInput, CDBCard, CDBCardBody, CDBIcon, CDBBtn, CDBLink, CDBContainer } from 'cdbreact';
import { isAuth } from "./helpers";

const Signup = () => {
    const [values, setValues] = useState({
        regId: "",
        pharmaName:"",
        email: "",
        password: "",
        buttonText: "Submit"
    })

    const { regId,pharmaName, email, password, buttonText } = values

    const handleChange = (pharmaName) => (event) => {
        setValues({...values, [pharmaName]: event.target.value})
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({...values, buttonText: 'Submitting'})
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signup`,
            data: {regId, pharmaName, email, password}
        })
        .then(response => {
            // console.log('SIGNUP SUCCESS',response)
            setValues({...values, regId:'', pharmaName:'', email:'', password:'', buttonText: 'Submitted'})
            toast.success(response.data.message)   
        })
        .catch(error =>{
            // console.log('SIGNUP ERROR', error.response.data)
            setValues({...values, buttonText:'Submit'})
            toast.error(error.response.data.error)
        })
    }

    const signupForm = () => {
        return (
            // <form className="col-md-8 offset-md-0 m-0">
            //     <div className="form-group">
            //         <label className="text-muted">Registration ID</label>
            //         <input onChange={handleChange('regId')} value={regId} type="text" className="form-control" style={{backgroundColor:'#e6ffff'}}/>
            //     </div>
            //     <div className="form-group">
            //         <label className="text-muted">Pharmacy Name</label>
            //         <input onChange={handleChange('pharmaName')} value={pharmaName} type="text" className="form-control" style={{backgroundColor:'#e6ffff'}}/>
            //     </div>
            //     <div className="form-group">
            //         <label className="text-muted">Email</label>
            //         <input onChange={handleChange('email')} value={email} type="email" className="form-control" style={{backgroundColor:'#e6ffff'}}/>
            //     </div>
            //     <div className="form-group">
            //         <label className="text-muted">Password</label>
            //         <input onChange={handleChange('password')} value={password} type="password" className="form-control" style={{backgroundColor:'#e6ffff'}}/>
            //     </div><br />
            //     <div>
            //         <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            //     </div>
            // </form>
            <CDBContainer>
            <div className="d-flex justify-content-center align-items-center">
                <CDBCard style={{ width: '30em', backgroundColor: 'white' }}>
                    <div style={{ background: 'skyblue' }} className="text-center text-black">
                        <p className="h5 mt-2 py-4 font-weight-bold">Sign Up</p>
                    </div>
                    <CDBCardBody className="mx-4">
                        <CDBInput hint="Registration ID" label="Registration ID" type="text" onChange={handleChange('regId')} value={regId} />
                        <CDBInput hint="Pharmacy Name" label="Pharmacy Name" type="text" onChange={handleChange('pharmaName')} value={pharmaName} />
                        <CDBInput hint="E-mail" label="Email" type="email" onChange={handleChange('email')} value={email} />
                        <CDBInput hint="Password" label="Password" type="password" onChange={handleChange('password')} value={password} />
                        <div className="mt-4 mb-1 d-flex flex-column gap-2 justify-content-center align-items-center">
                            <CDBBtn outline color="dark" type="submit" onClick={clickSubmit}>
                                {buttonText}
                            </CDBBtn>
                            <CDBLink to="/pharma/signin" className="ms-auto text-primary" >Already have an account?</CDBLink>
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
                {isAuth() ? <Navigate to="/"/> : null}
                {signupForm()}
            </div>
        </Layout>
    )
}
export default Signup;