import React from 'react';
import './AgreementStyles.css'; // Import the shared CSS

const zyppAgreement = `
This is the agreement text for zypp. It contains all the terms and conditions 
for the partnership between Spiro EV and zypp. Both parties must comply with the 
stipulated terms and sign digitally to proceed.
`;

const ZyppAgreement = () => {
  return (
    <div className="agreement-container">
      <h1 className="agreement-title">zypp Partnership Agreement</h1>
      <p className="agreement-text">
        {zyppAgreement}
      </p>
    </div>
  );
};

export default ZyppAgreement;
