import React from 'react';
import './AgreementStyles.css'; // Import the shared CSS

const rapidoAgreement = `
This is the agreement text for Rapido. It contains all the terms and conditions 
for the partnership between Spiro EV and Rapido. Both parties must comply with the 
stipulated terms and sign digitally to proceed.
`;

const RapidoAgreement = () => {
  return (
    <div className="agreement-container">
      <h1 className="agreement-title">Rapido Partnership Agreement</h1>
      <p className="agreement-text">
        {rapidoAgreement}
      </p>
    </div>
  );
};

export default RapidoAgreement;
