// Simple Credit Check Circuit
// For Circom 0.5.46

template SimpleCredit() {
    // Public input: minimum required score
    signal input minScore;
    
    // Private input: actual credit score
    signal input creditScore;
    
    // Check if credit score is above minimum
    // This creates a constraint that enforces creditScore >= minScore
    signal diff;
    diff <-- creditScore - minScore;
    diff >= 0;
    
    // Output 1 if check passes (implicitly true if we get here)
    signal output out;
    out <== 1;
}

component main = SimpleCredit();
