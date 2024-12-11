import React, { useState, useEffect } from "react";
import Web3 from "web3";
import './App.css';
import rapidoAgreement from "./partners/rapido"; // Agreement with Rapido
import PGAgreement from "./partners/PG";
import zyppAgreement from "./partners/zypp";
import defaultAgreement from "./partners/default";
import SpiroAgreementManager from './build/contracts/SpiroAgreementManager.json'; // Replace with your actual ABI JSON
const CONTRACT_ADDRESS = "0x4C45Ef8269Aa22f8fFa4Cbb6D03e12e671adC98C"; // Replace with deployed contract address

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [agreementId, setAgreementId] = useState("");
  const [signerAddress, setSignerAddress] = useState("");
  const [agreementHash, setAgreementHash] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");
  const [agreementDetails, setAgreementDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [currentAgreementText, setCurrentAgreementText] = useState("");
  const [party1Address, setParty1Address] = useState("");
  const [party1Signed, setParty1Signed] = useState(false);

  // Initialize Web3 and Contract
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.requestAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(SpiroAgreementManager.abi, CONTRACT_ADDRESS);
          setContract(contractInstance);
        } else {
          alert("MetaMask is not installed. Please install it to use this app.");
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    };

    initWeb3();
  }, []);

  // Create or Update Agreement by Adding a Signer
  const addSignerToAgreement = async () => {
    if (!contract) {
      alert("Unable to load the contract. Is your jsx reading the contract ABI correctly ?");
      return;
    }

    if (!agreementHash || !ipfsCID || !signerAddress) {
      alert("Please provide agreement hash, IPFS CID, and signer address.");
      return;
    }

    try {
      const receipt = await contract.methods
        .createAgreement(agreementHash, ipfsCID, [signerAddress])
        .send({ from: account });
      setMessage(`Signer ${signerAddress} added successfully! Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error("Error adding signer:", error);
      setMessage("Error adding signer to agreement.");
    }
  };

  // Fetch Agreement Details
  const viewAgreement = async () => {
    if (!agreementId) {
      alert("Please enter an agreement ID.");
      return;
    }

    try {
      const details = await contract.methods.viewAgreement(agreementId).call({ from: account });
      const signers = details[2]; // List of signer addresses
      const party1 = signers[0] || "Not Assigned";

      setParty1Address(party1);

      const party1HasSigned = party1 !== "Not Assigned"
        ? await contract.methods.hasSignerSigned(agreementId, party1).call()
        : false;

      setParty1Signed(party1HasSigned);
      setAgreementDetails({
        hash: details[0],
        ipfsCID: details[1],
        isComplete: details[3],
      });

// ****************************************************************************************************
// ****************************************************************************************************
// *******************************  ADD the Agreement Text here ***************************************
// ****************************************************************************************************
// ****************************************************************************************************

      // Load the specific agreement text based on signer address
      if (party1.toLowerCase() === "0xc21cd3735E3a9AABFBE27C706762C99538150f57".toLowerCase()) {
        setCurrentAgreementText(rapidoAgreement); // Set agreement text for Rapido
      }
      else if(party1.toLowerCase() === "0x3fEba14B2570eb3CA6804aB88AD1Fd1769c9b676".toLocaleLowerCase()) {
        setCurrentAgreementText(PGAgreement);
      }
      // else if(party1.toLowerCase() === "0x56c6B08EE790D538EEB89F4A0e41F93CbF4bDE97".toLocaleLowerCase()) {
      //   setCurrentAgreementText(zyppAgreement);
      // }
      // ... new agreement comes here
      else {
        setCurrentAgreementText(defaultAgreement);
      }


      setMessage("Agreement retrieved successfully!");
    } catch (error) {
      console.error("Error fetching agreement:", error);
      setMessage("Error: You might not be authorized to view this agreement.");
    }
  };

  // Sign Agreement
  const signAgreement = async () => {
    if (!agreementId) {
      alert("Please enter an agreement ID.");
      return;
    }

    try {
      const receipt = await contract.methods.signAgreement(agreementId).send({ from: account });

      // Update the signing status for Party 1 or Party 2
      if (account.toLowerCase() === party1Address.toLowerCase()) {
        setParty1Signed(true);
      }

      setMessage(`Signed agreement successfully! Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error("Error signing agreement:", error);
      setMessage("Error signing agreement.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Spiro Agreement Manager</h1>

      {account ? (
        <p>Connected Wallet: {account}</p>
      ) : (
        <button
          onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Connect Wallet
        </button>
      )}

      {/* Add Signer to Agreement Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Add Signer to Agreement</h3>
        <input
          type="text"
          placeholder="Agreement Hash"
          value={agreementHash}
          onChange={(e) => setAgreementHash(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="IPFS CID"
          value={ipfsCID}
          onChange={(e) => setIpfsCID(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Signer Address"
          value={signerAddress}
          onChange={(e) => setSignerAddress(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button onClick={addSignerToAgreement} style={{ padding: "10px 20px" }}>
          Add Signer
        </button>
      </div>

      {/* View Agreement Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>View Agreement</h3>
        <input
          type="text"
          placeholder="Enter Agreement ID"
          value={agreementId}
          onChange={(e) => setAgreementId(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button onClick={viewAgreement} style={{ padding: "10px 20px" }}>
          View Agreement
        </button>
      </div>

      {/* Display Agreement Details */}
      {agreementDetails && (
        <div className="agreement-container">
          <h4 className="agreement-title">Agreement Details:</h4>
          <p className="agreement-text"><strong>Hash:</strong> {agreementDetails.hash}</p>
          <p className="agreement-text"><strong>IPFS CID:</strong> {agreementDetails.ipfsCID}</p>
          <p className="agreement-text"><strong>Is Complete:</strong> {agreementDetails.isComplete ? "Yes" : "No"}</p>

          <p className="agreement-text"><strong>Party 1 Address:</strong> {party1Address}</p>
          <p className="agreement-text"><strong>Party 1 Signed:</strong> {party1Signed ? "Yes" : "No"}</p>

          {/* Display Agreement Text */}
          <div className="agreement-text-section">
            <h4 className="agreement-title">Agreement Text:</h4>
            <p>{currentAgreementText || "No agreement text available."}</p>
          </div>

          {/* Sign Agreement Button */}
          <button 
            className="agreement-sign-button" 
            onClick={signAgreement} 
            disabled={agreementDetails && agreementDetails.isComplete} // Disable when complete
          >
            {agreementDetails && agreementDetails.isComplete ? "Agreement Complete" : "Sign Agreement"}
          </button>
        </div>
      )}
      {message && <p style={{ color: "green", marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default App;