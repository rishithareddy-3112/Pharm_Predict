import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { isAuth, getCookie, signout, updateUser } from "../auth-components/helpers";
import withRouter from './WithRouter'


const Admin = ({ router }) => {
    const { navigate } = router
    const [values, setValues] = useState({
        role: "",
        pharmaName: "",
        email: "",
        password: "",
        buttonText: "Submit"
    })

    const token = getCookie('token')

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/pharma/${isAuth()._id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                const { role, pharmaName, email } = response.data
                setValues({ ...values, role, pharmaName, email })
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    signout(() => {
                        navigate("/")
                    })
                }
            })
    }

    const { role, pharmaName, email, password, buttonText } = values

    const handleChange = (pharmaName) => (event) => {
        setValues({ ...values, [pharmaName]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/admin/update`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { pharmaName, password }  //similar to body part in postman, i.e, allowing name and password to be changed
        })
            .then(response => {
                // console.log('SIGNUP SUCCESS', response)
                updateUser(response, () => {
                    setValues({ ...values, buttonText: 'Submitted' })
                    toast.success("Profile updated successfully")
                })
            })
            .catch(error => {
                // console.log('PROFILE UPDATE ERROR', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }

    const updateForm = () => {
        return (
            <form>
                <div className="form-group">
                    <label className="text-muted">Role</label>
                    <input defaultValue={role} type="text" className="form-control" disabled />
                </div>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input onChange={handleChange('pharmaName')} value={pharmaName} type="text" className="form-control" />
                </div>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input defaultValue={email} type="email" className="form-control" disabled />
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
                </div><br />
                <div>
                    <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
                </div>
            </form>
        )
    }
    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                <h1 className="pt-5 text-center">Admin</h1>
                <p className="lead text-center">Profile Update</p>
                {updateForm()}
            </div>
        </Layout>
    )
}
export default withRouter(Admin);