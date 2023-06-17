import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import './Logs.css';

function Logs() {
  const auth = UserAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': auth?.csrftoken ?? ""
    };
    
    axios.get(`/api/users/${auth?.user.uuid}/logs/products/`, {
      headers: headers
    })
    .then((response) => {
      console.log(response);
      setProducts(response.data);
    })
    .catch((err) => console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header
        className="logs__header"
        mainText="Tried Products"/>
      {
        products.length > 0
          ? <ProductGrid productArray={ products }/>
          : <>
              <p>Log products you've tried by tapping the plus icon on any product!</p>
            </>
      }
      
      <Navbar/>

      <Footer 
        className = "footer"
        text="© 2023 OriOri" />
    </div>
  );
};

export default Logs;