import React, { useState } from 'react';
import { CDBContainer, CDBRow, CDBCol, CDBInput, CDBBtn, CDBCard } from 'cdbreact';
import Layout from '../core-components/Layout';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'

const ClassicForm = () => {
    const [values, setValues] = useState({
        name: '',
        substitute0: '',
        substitute1: '',
        substitute2: '',
        substitute3: '',
        substitute4: '',
        sideEffect0: '',
        sideEffect1: '',
        sideEffect2: '',
        sideEffect3: '',
        sideEffect4: '',
        use0: '',
        use1: '',
        use2: '',
        use3: '',
        use4: '',
        ChemicalClass: '',
        ActionClass: '',
        buttonText: "Submit"
    })

    const { name, substitute0, substitute1, substitute2, substitute3, substitute4, sideEffect0, sideEffect1, sideEffect2, sideEffect3, sideEffect4, use0, use1, use2, use3, use4, ChemicalClass, ActionClass } = values

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, buttonText: 'Submitting' })
        axios({ 
            method: 'POST',
            url: `${process.env.REACT_APP_API}/admin/add-medicine`,
            data: { name, substitute0, substitute1, substitute2, substitute3, substitute4, sideEffect0, sideEffect1, sideEffect2, sideEffect3, sideEffect4, use0, use1, use2, use3, use4, ChemicalClass, ActionClass }
        })
            .then(response => {
                setValues({ name: '', substitute0: '', substitute1: '', substitute2: '', substitute3: '', substitute4: '', sideEffect0: '', sideEffect1: '', sideEffect2: '', sideEffect3: '', sideEffect4: '', use0: '', use1: '', use2: '', use3: '', use4: '', ChemicalClass: '', ActionClass: '', buttonText: 'Submitted' })
                toast.success(response.data.message) 
            })
            .catch(error => {
                toast.error(error.response.data.error)
            })
    }
    return (
        <Layout>
            <ToastContainer />
            <CDBContainer>
                <h1 className="text-center mb-2">Drug Information Form</h1>

                <CDBCard className='p-3'>
                    <CDBInput type="text" label="Drug Name" id="drugName" onChange={handleChange('name')} value={name} />
                    <CDBRow>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="substitute0" id="substitute0" onChange={handleChange('substitute0')} value={substitute0} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="substitute1" id="substitute1" onChange={handleChange('substitute1')} value={substitute1} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="substitute2" id="substitute2" onChange={handleChange('substitute2')} value={substitute2} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="substitute3" id="substitute3" onChange={handleChange('substitute3')} value={substitute3} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="substitute4" id="substitute4" onChange={handleChange('substitute4')} value={substitute4} />
                        </CDBCol>
                    </CDBRow>

                    <CDBRow>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="sideEffect0" id="sideEffect0" onChange={handleChange('sideEffect0')} value={sideEffect0} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="sideEffect1" id="sideEffect1" onChange={handleChange('sideEffect1')} value={sideEffect1} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="sideEffect2" id="sideEffect2" onChange={handleChange('sideEffect2')} value={sideEffect2} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="sideEffect3" id="sideEffect3" onChange={handleChange('sideEffect3')} value={sideEffect3} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="sideEffect4" id="sideEffect4" onChange={handleChange('sideEffect4')} value={sideEffect4} />
                        </CDBCol>
                    </CDBRow>

                    <CDBRow>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="use0" id="use0" onChange={handleChange('use0')} value={use0} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="use1" id="use1" onChange={handleChange('use1')} value={use1} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="use2" id="use2" onChange={handleChange('use2')} value={use2} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="use3" id="use3" onChange={handleChange('use3')} value={use3} />
                        </CDBCol>
                        <CDBCol md="auto">
                            <CDBInput type="text" label="use4" id="use4" onChange={handleChange('use4')} value={use4} />
                        </CDBCol>
                    </CDBRow>

                    <CDBInput type="text" label="Chemical Class" id="chemicalClass" onChange={handleChange('ChemicalClass')} value={ChemicalClass} />

                    <CDBInput type="text" label="Action Class" id="actionClass" onChange={handleChange('ActionClass')} value={ActionClass} />
                    <div className="mt-4 mb-1 d-flex flex-column justify-content-center align-items-center">
                        <CDBBtn outline className='mt-2' color="dark" type="submit" onClick={clickSubmit}>
                            Submit
                        </CDBBtn>
                    </div>
                </CDBCard>
            </CDBContainer>
        </Layout>
    );
};

export default ClassicForm;
