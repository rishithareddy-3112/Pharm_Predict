import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Layout from './Layout'
import { isAuth } from '../auth-components/helpers'
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jsPDF from 'jspdf';
const ViewCart = () => {
  const [userCart, setUserCart] = useState([]);
  const total = 0;
  const [invoiceContent, setInvoiceContent] = useState('');
  // const [count, setCount] = useState(0)
  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/user-cart/${isAuth()._id}`);
        // setUserCart(response.data.cart);
        const cartWithCount = response.data.cart.map(item => ({ ...item, count: 1 }));
        setUserCart(cartWithCount);
      } catch (error) {
        console.error('Error fetching user cart:', error);
      }
    };

    fetchUserCart();
  }, []);

  const removeFromCart = (drugId, indexToRemove, userId) => {
    const updatedCart = [...userCart];
    updatedCart.splice(indexToRemove, 1);
    // const updatedCart = userCart.filter((_, index) => index !== indexToRemove);
    setUserCart(updatedCart);
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_API}/remove-from-cart/${userId}/${drugId}`,
    })
      .then((res) => {
        toast.error(res.data.message);
      })
      .catch(() => {
        toast.error('Error removing product from cart, try again!');
      })
  }

  const incrementCount = (index) => {
    const updatedCart = [...userCart];
    updatedCart[index].count += 1;
    setUserCart(updatedCart);
  };

  const decrementCount = (index) => {
    const updatedCart = [...userCart];
    if (updatedCart[index].count > 1) {
      updatedCart[index].count -= 1;
    }
    setUserCart(updatedCart);
  };
  const generateInvoice = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
  
    // Set initial y position
    let y = 10;
  
    // Set font style for title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
  
    // Add title
    doc.text("Invoice", 20, y);
    y += 10;
  
    // Reset font style for items
    doc.setFont("helvetica");
    doc.setFontSize(12);
  
    // Add items
    userCart.forEach((medicine, index) => {
      const itemString = `${index + 1}. ${medicine.name.toUpperCase()} - Quantity: ${medicine.count} - Price: ₹${Math.floor(medicine.price / 3) * medicine.count}.00`;
      
      // Calculate the width of the text
      const textWidth = doc.getStringUnitWidth(itemString) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  
      // Check if the text exceeds the width of the page
      if (textWidth > doc.internal.pageSize.width - 20) {
        // If yes, move to the next line
        y += 7;
      }
      
      // Add the item to the PDF
      doc.text(itemString, 20, y);
  
      // Move to the next line
      y += 7; // Adjust spacing between items
    });
  
    // Set font style for total
    doc.setFont("helvetica", "bold");
  
    // Add total
    const totalString = `Total: ₹${userCart.reduce((total, medicine) => total + (Math.floor(medicine.price / 3) * medicine.count), 0)}.00`;
    doc.text(totalString, 20, y);
    
    // Save the PDF
    doc.save("invoice.pdf");
  };

  return (
    <Layout>
      <ToastContainer />
      <div>
        <h1 style={{ textAlign: 'center' }}>My Cart:</h1>
        <Button variant='success' style={{ marginLeft: '56rem', marginBottom: '1rem' }} onClick={generateInvoice}>Download Invoice<i class="fa fa-download" aria-hidden="true"></i></Button>
      </div>
      {userCart ? (
        <Table striped bordered hover responsive>
          <thead style={{ textAlign: 'center' }}>
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            {userCart.map((medicine, index) => (
              <tr key={index}>
                <td style={{ display: 'grid', gridTemplateColumns: 'auto 8rem 8rem', placeItems: 'center' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2rem 2rem 2rem 20rem', placeItems: 'center' }}>
                    <Button className='decrease' variant='secondary' onClick={() => decrementCount(index)} style={{ cursor: 'pointer', border: '1px solid black', padding: '0.5rem', borderRadius: '10%' }}>-</Button>
                    <div style={{ width: '2rem', height: '2rem', border: '2px solid black', backgroundColor: 'black', borderRadius: '50%', color: 'white', marginLeft: '0.3rem', marginRight: '0.3rem' }}>{medicine.count}</div>
                    <Button className='increase' variant='secondary' onClick={() => incrementCount(index)} style={{ cursor: 'pointer', border: '1px solid black', padding: '0.5rem', borderRadius: '10%' }}>+</Button>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 2rem' }}>
                      <div>{medicine.name.toUpperCase()}<b> {" ₹" + Math.floor(medicine.price / 3) * medicine.count + ".00"}</b></div>
                    </div>
                  </div>
                  {/* <Button variant='success' style={{ border: '1.5px solid black', borderRadius: '10px', marginRight: '6px' }}>Buy</Button> */}
                  <Button variant='danger' onClick={() => removeFromCart(medicine.id, index, isAuth()._id)} style={{ border: '1.5px solid white', borderRadius: '10px' }} >Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
          <div style={{ textAlign: 'center' }}>
            <b><h4>Total : {" ₹" + userCart.reduce((total, medicine) => total + (Math.floor(medicine.price / 3) * medicine.count), 0) + ".00"}</h4></b>
          </div>
        </Table>
      ) : (
        <p>Loading cart...</p>
      )}
    </Layout>
  )
}
export default ViewCart