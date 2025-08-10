import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import axios from 'axios';
import { Table } from 'react-bootstrap';
const ViewOrders = () => {
    const [orders, setOrders] = useState([])
    let [max, setMax] = useState("");
    const updatedDrugs = { "ANTI INFECTIVES": 0, "ANTI DIABETIC": 0, "CARDIAC": 0, "DERMA": 0, "NEURO CNS": 0, "GASTRO INTESTINAL": 0, "OPTHAL": 0, "PAIN ANALGESICS": 0, "RESPIRATORY": 0, "OPTHAL OTOLOGICALS": 0, "OTOLOGICALS": 0, "VITAMINS MINERALS NUTRIENTS": 0 }
    let maxValue = 0;
    let ans = "";
    const getMax = () => {
        for (const key in updatedDrugs) {
            const value = updatedDrugs[key];
            if (typeof value === 'number' && value > maxValue) {
                maxValue = value;
                max = key;
            }
        }
        setMax(max);
    }
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/orders`);
                setOrders(Object.entries(response.data.orders))
                Object.entries(response.data.orders).forEach(([orderId, order]) => {
                    order.forEach(item => {
                        if (item.class) {
                            updatedDrugs[item.class] += 1;
                        }
                    });
                });
                getMax();
                

            } catch (error) {
                console.error('Error fetching user cart:', error);
            }
        };

        fetchOrders();
    }, []);
    return (
        <Layout>
            <h1 style={{ textAlign: 'center' }}>Orders</h1>
            <Table striped bordered hover>
                <thead>
                    <tr style={{ textAlign: 'center' }}>
                        <th>Pharmacy Name</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {orders.map(([orderId, order]) => (
                        <tr key={orderId}>
                            <td>{orderId}</td>
                            <td>
                                <ul style={{ listStyleType: 'none' }}>
                                    {order.map(item => (
                                        <li key={item.id}>
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </Table>
            <div style={{ textAlign: 'center' }}>
                <p>Mostly used drug: <b>{max}</b></p>
            </div>
        </Layout>
    )
}
export default ViewOrders;