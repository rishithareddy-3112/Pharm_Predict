// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, Button, Row, Col, Alert, Form, Spinner } from 'react-bootstrap';
// import { BeatLoader } from 'react-spinners';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import Layout from './Layout';
// import { toast, ToastContainer } from 'react-toastify'
// import { isAuth } from '../auth-components/helpers';
// import '../App.css'

// const DisplayMedicine = () => {
//     const [medicineData, setMedicineData] = useState([]);
//     const [visibleMedicines, setVisibleMedicines] = useState(10);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loadingReset, setLoadingReset] = useState(false);
//     const [therapeuticClass, setTherapeuticClass] = useState(Array(medicineData.length).fill(null));
//     const [showTherapeuticClass, setShowTherapeuticClass] = useState({});
//     const [clickedButtonIndex, setClickedButtonIndex] = useState();

//     useEffect(() => {
//         const initialShowState = {};
//         for (let i = 0; i < medicineData.length; i++) {
//             initialShowState[i] = false;
//         }
//         setShowTherapeuticClass(initialShowState);
//     }, [medicineData.length]);

//     const fetchMedicineData = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_API}/display-medicine`, {
//                 params: {
//                     page: 1, // Set the initial page
//                     limit: 10, // Set the initial limit
//                 },
//             });
//             setMedicineData(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error(error);
//             setError('Error fetching medicine data');
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchMedicineData();
//     }, []);
//     const loadMore = () => {
//         setVisibleMedicines((prevCount) => prevCount + 10);
//         fetchMoreMedicineData()
//     };
//     const fetchMoreMedicineData = async () => {
//         try {
//             const response = await axios.get(`${process.env.REACT_APP_API}/display-medicine`, {
//                 params: {
//                     page: Math.ceil((visibleMedicines + 1) / 10),
//                     limit: 10,
//                 },
//             });
//             setMedicineData([...medicineData, ...response.data]);
//         } catch (error) {
//             console.error(error);
//             setError('Error fetching more medicine data');
//         }
//     };

//     const handleSearch = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${process.env.REACT_APP_API}/search-medicine?searchTerm=${searchTerm}`);
//             setMedicineData(response.data);
//             setVisibleMedicines(10);
//         } catch (error) {
//             toast.error(error.response.data.error)
//             setError('Error searching medicine data');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const resetSearch = async () => {
//         try {
//             setLoadingReset(true);
//             setSearchTerm('');
//             await fetchMedicineData();
//             setVisibleMedicines(10);
//         } finally {
//             setLoadingReset(false);
//         }
//     };

//     const predictClass = async (medicine, index) => {
//         try {
//             // setLoading(true);
//             console.log(medicine)
//             const response = await axios.post(`${process.env.REACT_APP_API}/predict-class`, {
//                 input_data: medicine,
//             });
//             setTherapeuticClass((prev) => {
//                 const updatedTherapeuticClass = [...prev];
//                 updatedTherapeuticClass[index] = response.data.message;
//                 return updatedTherapeuticClass;
//             });

//             setShowTherapeuticClass((prev) => ({
//                 ...prev,
//                 [index]: true,
//             }));

//             setClickedButtonIndex(index);
//             toast.success(response.data.message);
//             setTimeout(() => {
//                 setShowTherapeuticClass(false);
//                 setClickedButtonIndex(null);
//             }, 3000);
//         } catch (error) {
//             console.log(error)
//             toast.error('Error predicting therapeutic class');
//         } finally {
//             // setLoading(false);
//         }
//     }

//     const addToCart = async (medicine, id, e) => {
//         e.preventDefault()
//         console.log(medicine, id)
//         await axios.post(`${process.env.REACT_APP_API}/add-to-cart`, {
//             medicine: medicine,
//             id: id
//         })
//             .then((response) => {
//                 toast.success(response.data.message)
//             })
//             .catch((err) => {
//                 toast.error("Error adding product to cart")
//             })
//     }

//     if (loading || error) {
//         return (
//             <div className={`text-center mt-5 ${error ? 'error-state' : ''}`}>
//                 {error ? (
//                     <Alert variant="danger">
//                         <strong>Error:</strong> {error}
//                     </Alert>
//                 ) : (
//                     <BeatLoader color="#007bff" size={15} />
//                 )}
//             </div>
//         );
//     }

//     return (
//         <Layout>
//             <ToastContainer />
//             <div>
//                 <Form className="m-3">
//                     <Row className="justify-content-end">
//                         <Col xs="auto">
//                             <Form.Group controlId="searchTerm">
//                                 <Row className="align-items-center m-0">
//                                     <Col xs="auto">
//                                         <FontAwesomeIcon icon={faSearch} />
//                                     </Col>
//                                     <Col xs="auto">
//                                         <Form.Control
//                                             type="text"
//                                             placeholder="Search for a drug..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                         />
//                                     </Col>
//                                 </Row>
//                             </Form.Group>
//                         </Col>
//                         <Col xs="auto">
//                             <Button variant="info" className="mr-2" onClick={handleSearch}>
//                                 {' '}Search
//                             </Button>
//                         </Col>
//                         <Col xs="auto">
//                             <Button variant="secondary" onClick={resetSearch}>
//                                 {loadingReset ? (
//                                     <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
//                                 ) : (
//                                     'Reset'
//                                 )}
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Form>
//                 <Row>
//                     {medicineData.slice(0, visibleMedicines).map((medicine, index) => (
//                         <Col key={index} md={6}>
//                             <Card className="m-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'lightblue', width: '85%', height: '85%' }}>
//                                 <Card.Body className='text-center'>
//                                     <Card.Title>{medicine.name.toUpperCase()}</Card.Title>
//                                     <Card.Title>{medicine.ChemicalClass !== 'NA' ? medicine.ChemicalClass : ' '}</Card.Title>
//                                     <Card.Text><strong>Substitutes:</strong> {medicine.substitute0},{' '}{medicine.substitute1},{' '}{medicine.substitute2}</Card.Text>
//                                     <Card.Text><strong>Side Effects:</strong> {medicine.sideEffect0},{' '}{medicine.sideEffect1}, {' '}{medicine.sideEffect2}</Card.Text>
//                                     <Card.Text><strong>Uses:</strong> {medicine.use0},{' '}{medicine.use1}, {' '}{medicine.use2}</Card.Text>
//                                     {clickedButtonIndex === index && showTherapeuticClass[index] && (
//                                         // <div className={`therapeutic-class-overlay ${showTherapeuticClass[index] ? 'show' : ''}`}>
//                                         <div className='therapeutic-class-overlay'>
//                                             <span><b><i>{therapeuticClass[index]}</i></b></span>
//                                         </div>
//                                     )}
//                                     <Button variant='success' style={{ paddingLeft: '20px', paddingRight: '20px', border: '1.5px solid black', borderRadius: '10px' }} onClick={(e) => addToCart(medicine, isAuth()._id, e)}>Add to Cart</Button>
//                                     <Button variant='dark' onClick={() => predictClass(medicine, index)} style={{ paddingLeft: '20px', paddingRight: '20px', marginLeft: '10px', border: '1.5px solid white', borderRadius: '10px' }} >Find Therapeutic Class</Button>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     ))}
//                 </Row>
//                 <div className='text-center'>
//                     <Button variant="info" className="mt-3 mb-3" onClick={loadMore}>
//                         View More
//                     </Button>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default DisplayMedicine;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';
import { Image } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import { isAuth } from '../auth-components/helpers';
import '../App.css'

const DisplayMedicine = () => {
    const [medicineData, setMedicineData] = useState([]);
    const [visibleMedicines, setVisibleMedicines] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingReset, setLoadingReset] = useState(false);
    const [therapeuticClass, setTherapeuticClass] = useState(Array(medicineData.length).fill(null));
    const [showTherapeuticClass, setShowTherapeuticClass] = useState({});
    const [clickedButtonIndex, setClickedButtonIndex] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMedicineData();
    }, [currentPage]);

    useEffect(() => {
        const initialShowState = {};
        for (let i = 0; i < medicineData.length; i++) {
            initialShowState[i] = false;
        }
        setShowTherapeuticClass(initialShowState);
    }, [medicineData.length]);

    // useEffect(() => {
    //     fetchMedicineData();
    // }, []);

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchMedicineData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/display-medicine`, {
                params: {
                    page: currentPage,
                    limit: visibleMedicines,
                },
            });
            setMedicineData(response.data);
            setTotalPages(Math.ceil(250000 / 10));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Error fetching medicine data');
            setLoading(false);
        }
    };

    const loadMore = async () => {
        setVisibleMedicines(prevVisibleMedicines => prevVisibleMedicines + 10);
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API}/search-medicine?searchTerm=${searchTerm}`);
            setMedicineData(response.data);
            setVisibleMedicines(10);
        } catch (error) {
            toast.error(error.response.data.error)
            setError('Error searching medicine data');
        } finally {
            setLoading(false);
        }
    };

    const resetSearch = async () => {
        try {
            setLoadingReset(true);
            setSearchTerm('');
            await fetchMedicineData();
            setVisibleMedicines(10);
        } finally {
            setLoadingReset(false);
        }
    };

    const predictClass = async (medicine, index) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/predict-class`, {
                input_data: medicine,
            });
            setTherapeuticClass((prev) => {
                const updatedTherapeuticClass = [...prev];
                updatedTherapeuticClass[index] = response.data.message;
                return updatedTherapeuticClass;
            });

            setShowTherapeuticClass((prev) => ({
                ...prev,
                [index]: true,
            }));

            setClickedButtonIndex(index);
            toast.success(response.data.message);
            setTimeout(() => {
                setShowTherapeuticClass(false);
                setClickedButtonIndex(null);
            }, 3000);
        } catch (error) {
            console.log(error)
            toast.error('Error predicting therapeutic class');
        }
    }

    const addToCart = async (medicine, id, e) => {
        e.preventDefault()
        console.log(medicine, id)
        await axios.post(`${process.env.REACT_APP_API}/add-to-cart`, {
            medicine: medicine,
            id: id
        })
            .then((response) => {
                toast.success(response.data.message)
            })
            .catch((err) => {
                toast.error("Error adding product to cart")
            })
    }

    const showDrugCard = async (medicine) => {
        console.log(medicine)
        const card = document.createElement('div');
        card.classList.add('drug-card');

        const crossMark = document.createElement('div');
        crossMark.classList.add('cross-mark');
        crossMark.textContent = 'X';
        card.appendChild(crossMark);

        const medicineInfo = document.createElement('div');
        medicineInfo.innerHTML = "<b> Name </b> : " + medicine.name + "<br>" +
            "<b> Substitues </b> : " + medicine.substitute0 + ", " + medicine.substitute1 + ", " + medicine.substitute2 + "," + medicine.substitute3 + ", " + medicine.substitute4 + "<br>" + " <b> Side Effects </b>: " + medicine.sideEffect0 + ", " + medicine.sideEffect1 + ", " + medicine.sideEffect2;
        card.appendChild(medicineInfo);

        card.style.position = 'fixed';
        card.style.top = '50%';
        card.style.left = '50%';
        card.style.transform = 'translate(-5%, -110%)';
        card.style.width = '400px';
        card.style.height = '200px';
        card.style.padding = '10px';
        card.style.boxShadow = '1px 0px 2px 1px';
        document.getElementById('root').style.filter = 'blur(5px)'
        card.style.border = '2px solid grey';
        card.style.borderRadius = '5px';
        card.style.backgroundColor = '#f9f9f9';
        card.style.zIndex = '9999';
        crossMark.style.position = 'absolute';
        crossMark.style.top = '5px';
        crossMark.style.right = '5px';
        crossMark.style.color = 'red';
        crossMark.style.cursor = 'pointer';
        crossMark.style.border = '2px solid grey'
        crossMark.style.padding = '3px'
        crossMark.addEventListener('click', () => {
            document.body.removeChild(card);
            document.getElementById('root').style.filter = 'blur(0)'
        });
        document.body.appendChild(card);
    }

    if (loading || error) {
        return (
            <div className={`text-center mt-5 ${error ? 'error-state' : ''}`}>
                {error ? (
                    <Alert variant="danger">
                        <strong>Error:</strong> {error}
                    </Alert>
                ) : (
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                )}
            </div>
        );
    }

    return (
        <Layout>
            <ToastContainer />
            <div>
                <Form className="m-3">
                    <Form.Group controlId="searchTerm">
                        <Form.Control
                            type="text"
                            style={{ width: '20rem', marginBottom: '1rem' }}
                            placeholder="Search for a drug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="info" className="mr-2" onClick={handleSearch} style={{ marginRight: '1rem' }}>
                        <FontAwesomeIcon icon={faSearch} />
                        {' '}Search
                    </Button>
                    <Button variant="secondary" onClick={resetSearch} disabled={loadingReset}>
                        {loadingReset ? 'Resetting...' : 'Reset'}
                    </Button>
                </Form>
                <Table striped bordered hover responsive>
                    <thead style={{ textAlign: 'center' }}>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        {medicineData.map((medicine, index) => (
                            <tr key={index}>
                                <td>
                                    <div>
                                        {medicine.name.toUpperCase()}
                                        <Image src='../../info_icon.png' className='description' style={{ width: '1.5rem', height: '1.9rem', marginLeft: '1rem', cursor: 'pointer', borderRadius: '20%' }} onClick={() => showDrugCard(medicine)}></Image>
                                        <div><p> {medicine.name.includes("syrup") || medicine.name.includes("cream") ? "₹"+Math.floor(medicine.price/3)+".00": "(strip of 15)"+" ₹"+Math.floor(medicine.price/3)+".00"}</p></div>
                                    </div>
                                </td>
                                <td>
                                    {isAuth() && isAuth().role === "pharma" &&<Button variant='success' style={{ marginRight: '1rem' }} onClick={(e) => addToCart(medicine, isAuth()._id, e)}>Add to Cart</Button>}
                                    <Button variant='dark' onClick={() => predictClass(medicine, index)} style={{ marginLeft: '10px' }}>Find Therapeutic Class</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="pagination" style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto auto auto auto', columnGap: '3px', marginBottom: '2rem' }}>
                    <Button variant="secondary" disabled={currentPage === 1} style={{ margin: '0' }} onClick={handlePrevPage}>
                        Previous
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                        <Button
                            key={i}
                            variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button variant="secondary" disabled={currentPage === totalPages} onClick={handleNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default DisplayMedicine;
