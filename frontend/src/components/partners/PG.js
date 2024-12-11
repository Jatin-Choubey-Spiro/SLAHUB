import React from 'react';
import './AgreementStyles.css'; // Import the shared CSS

const pgAgreement = `
This is the agreement text for PG. It contains all the terms and conditions 
for the partnership between Spiro EV and PG. Both parties must comply with the 
stipulated terms and sign digitally to proceed.
`;

const PGAgreement = () => {
  return (
    <div className="agreement-container">
      <h1 className="agreement-title">PG Partnership Agreement</h1>
      <p className="agreement-text">
        {pgAgreement}
      </p>
    </div>
  );
};

export default PGAgreement;
