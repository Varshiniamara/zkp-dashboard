pragma circom 2.0.0;

// Rollup Batch Circuit for zk-Rollup
// Batches multiple credit checks into a single proof

template BatchCreditCheck(batchSize) {
    // Public inputs
    signal input minCreditScore;
    
    // Private inputs: batch of credit scores
    signal private input creditScores[batchSize];
    
    // Verify all credit scores meet minimum
    signal valid[batchSize];
    
    for (var i = 0; i < batchSize; i++) {
        signal diff;
        diff <-- creditScores[i] - minCreditScore;
        diff >= 0;
        valid[i] <== 1;
    }
    
    // Output: all valid
    signal output allValid;
    allValid <== 1;
}

// Main component with batch size of 4 (can be increased)
component main {public [minCreditScore]} = BatchCreditCheck(4);

