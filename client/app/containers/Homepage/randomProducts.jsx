import React, {useEffect, useState } from "react";
import { connect } from 'react-redux'
import "./css/RandomProducts.css";
import { API_URL } from "../../constants";
import { Link, Route } from "react-router-dom/cjs/react-router-dom.min";


function RandomHomepageProduct(){
    const [productsData, setProductsData]=useState([])
        
    useEffect(() => {
        fetch(`${API_URL}/product/random`)
          .then(res => res.json())
          .then(data => {
            // console.log(API_URL)
            // console.log('Products:', data);
            setProductsData(data);
          })
          .catch(err => console.error('Failed to fetch offers:', err));
      }, []);

    return(
            <div className="random-wrapper">
            <h1>Explore Today's Picks!</h1>
                <div className="product-grid">
                        {productsData.map((item)=>(
                            <Link to={`/product/${item.slug}`} key={item._id}>
                                <div className="product-card">
                                    <img src={item.imageUrl?item.imageUrl:"images/placeholder-image.png"} alt="" />
                                    <div className="title">
                                        <div className="product-name"><h2>{item.name}</h2></div>
                                        <div><h3>₹{item.price}</h3></div> 
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        )
}

export default RandomHomepageProduct;
