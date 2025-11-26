// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZkRollup {
    // State Root of the Rollup
    bytes32 public stateRoot;
    
    // Batch counter
    uint256 public batchCount;
    
    event BatchSubmitted(uint256 indexed batchId, bytes32 newStateRoot, uint256 txCount);
    
    constructor(bytes32 _initialStateRoot) {
        stateRoot = _initialStateRoot;
        batchCount = 0;
    }
    
    // Submit a batch of transactions with a ZK proof
    function submitBatch(
        bytes32 _newStateRoot,
        bytes calldata _proof,
        uint256 _txCount
    ) external {
        // 1. Verify the ZK Proof (omitted for brevity, would call a Verifier contract)
        // require(verifier.verify(_proof, stateRoot, _newStateRoot), "Invalid Proof");
        
        // 2. Update State Root
        stateRoot = _newStateRoot;
        batchCount++;
        
        emit BatchSubmitted(batchCount, _newStateRoot, _txCount);
    }
    
    // Helper to verify if a user exists in the current state (Merkle Proof verification)
    function verifyUser(
        bytes32 _userHash,
        bytes32[] calldata _merkleProof
    ) external view returns (bool) {
        bytes32 computedHash = _userHash;
        
        for (uint256 i = 0; i < _merkleProof.length; i++) {
            bytes32 proofElement = _merkleProof[i];
            
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        
        return computedHash == stateRoot;
    }
}
