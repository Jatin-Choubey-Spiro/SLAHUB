// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SpiroAgreementManager {
    struct Agreement {
        string agreementHash; // Agreement hash (encrypted or plaintext hash)
        string ipfsCID;       // CID pointing to IPFS file if applicable
        address[] signers;    // List of signers (Spiro and vendors)
        mapping(address => bool) hasSigned; // Track whether each address has signed
        bool isComplete;      // Status of whether all parties have signed
    }

    address public owner; // Spiro as the deployer and owner of the contract
    mapping(uint256 => Agreement) private agreements; // Agreements indexed by ID
    uint256 public agreementCount; // Number of agreements

    event AgreementCreated(uint256 agreementId, string ipfsCID, string agreementHash);
    event AgreementSigned(uint256 agreementId, address signer);
    event SignerAdded(uint256 agreementId, address signer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Create a new agreement
    function createAgreement(string calldata _agreementHash, string calldata _ipfsCID, address[] calldata _signers) external onlyOwner {
        require(_signers.length > 0, "At least one signer must be added");

        uint256 agreementId = agreementCount;
        Agreement storage agreement = agreements[agreementId];
        agreement.agreementHash = _agreementHash;
        agreement.ipfsCID = _ipfsCID;

        // Add signers and initialize signing status
        for (uint256 i = 0; i < _signers.length; i++) {
        agreements[agreementId].signers.push(_signers[i]);
        agreements[agreementId].hasSigned[_signers[i]] = false;
    }

        agreementCount++;
        emit AgreementCreated(agreementId, _ipfsCID, _agreementHash);
    }

    // Allow the owner (Spiro) to sign first, then any signer can sign
    function signAgreement(uint256 _agreementId) external {
        Agreement storage agreement = agreements[_agreementId];
        require(!agreement.isComplete, "Agreement is already complete");

        // Check if the caller is the owner (Spiro) and sign first
        if (msg.sender == owner) {
            require(!agreement.hasSigned[owner], "Owner has already signed this agreement");
            agreement.hasSigned[owner] = true;
            emit AgreementSigned(_agreementId, msg.sender);
        } else {
            // Check if the caller is one of the vendors
            bool isSigner = false;
            for (uint256 i = 0; i < agreement.signers.length; i++) {
                if (agreement.signers[i] == msg.sender) {
                    isSigner = true;
                    break;
                }
            }
            require(isSigner, "You are not a signer of this agreement");
            require(!agreement.hasSigned[msg.sender], "You have already signed this agreement");

            agreement.hasSigned[msg.sender] = true;
            emit AgreementSigned(_agreementId, msg.sender);
        }

        // Check if all parties have signed
        bool allSigned = true;
        for (uint256 i = 0; i < agreement.signers.length; i++) {
            if (!agreement.hasSigned[agreement.signers[i]]) {
                allSigned = false;
                break;
            }
        }

        // Owner must sign first, and then the other signers can sign
        if (allSigned && agreement.hasSigned[owner]) {
            agreement.isComplete = true;
        }
    }

    // View an agreement's details (accessible by the owner or the signers)
    function viewAgreement(uint256 _agreementId)
        external
        view
        returns (
            string memory,
            string memory,
            address[] memory,
            bool
        )
    {
        Agreement storage agreement = agreements[_agreementId];

        // Allow the owner to view any agreement
        if (msg.sender != owner) {
            // Ensure the caller is one of the signers if not the owner
            bool isSigner = false;
            for (uint256 i = 0; i < agreement.signers.length; i++) {
                if (agreement.signers[i] == msg.sender) {
                    isSigner = true;
                    break;
                }
            }
            require(isSigner, "You are not authorized to view this agreement");
        }

        return (
            agreement.agreementHash,
            agreement.ipfsCID,
            agreement.signers,
            agreement.isComplete
        );
    }

    // Check if a specific signer has signed an agreement
    function hasSignerSigned(uint256 _agreementId, address _signer) external view returns (bool) {
        Agreement storage agreement = agreements[_agreementId];
        return agreement.hasSigned[_signer];
    }
}