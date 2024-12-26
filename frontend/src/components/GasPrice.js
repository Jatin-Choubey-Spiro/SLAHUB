// src/components/GasPrice.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
require('dotenv').config();

const GasPrice = () => {
  const [gasPrice, setGasPrice] = useState(null);

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const response = await axios.get(`https://owlracle.info/sepolia?apikey=58cbbf110630457787d8a099f8b70b06`);
        setGasPrice(response.data.standard);
      } catch (error) {
        console.error('Error fetching gas prices:', error);
      }
    };

    fetchGasPrice();
  }, []);

  return (
    <div>
      <h1>Current Gas Price: {gasPrice}</h1>
    </div>
  );
};

export default GasPrice;