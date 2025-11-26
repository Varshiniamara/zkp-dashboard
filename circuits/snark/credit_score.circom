pragma circom 2.0.0;

// Circuit to verify credit score is within valid range (300-900)
// and meets a minimum threshold (e.g., 700 for loan approval)

template CreditScore(minScore) {
    // Public inputs
    signal input minScore;  // Minimum required score (public)
    
    // Private inputs
    signal private input creditScore;  // User's actual credit score (private)
    
    // Constants
    var MIN_CREDIT_SCORE = 300;
    var MAX_CREDIT_SCORE = 900;
    
    // 1. Verify credit score is within valid range (300-900)
    // creditScore >= MIN_CREDIT_SCORE
    component rangeCheckLower = GreaterEqThan(32);
    rangeCheckLower.in[0] <== creditScore;
    rangeCheckLower.in[1] <== MIN_CREDIT_SCORE;
    
    // creditScore <= MAX_CREDIT_SCORE
    component rangeCheckUpper = LessEqThan(32);
    rangeCheckUpper.in[0] <== creditScore;
    rangeCheckUpper.in[1] <== MAX_CREDIT_SCORE;
    
    // 2. Verify credit score meets minimum requirement
    // creditScore >= minScore
    component minScoreCheck = GreaterEqThan(32);
    minScoreCheck.in[0] <== creditScore;
    minScoreCheck.in[1] <== minScore;
    
    // Output 1 if all checks pass, 0 otherwise
    signal output isValid <== rangeCheckLower.out * rangeCheckUpper.out * minScoreCheck.out;
}

// Helper templates for comparisons
template GreaterEqThan(n) {
    signal input in[2];
    signal output out;
    
    signal diff;
    diff <-- in[0] - in[1];
    
    // Check if diff is non-negative
    component isPositive = IsPositive();
    isPositive.in <== diff;
    
    out <== isPositive.out;
}

template LessEqThan(n) {
    signal input in[2];
    signal output out;
    
    signal diff;
    diff <-- in[1] - in[0];  // Note: swapped inputs compared to GreaterEqThan
    
    // Check if diff is non-negative
    component isPositive = IsPositive();
    isPositive.in <== diff;
    
    out <== isPositive.out;
}

template IsPositive() {
    signal input in;
    signal output out;
    
    signal temp;
    temp <-- in;
    
    // Check if in is non-negative
    component isNegative = IsNegative();
    isNegative.in <== in;
    
    out <== 1 - isNegative.out;
}

template IsNegative() {
    signal input in;
    signal output out;
    
    // Check if in is negative using the sign bit
    signal signBit <-- (in >> 31) & 1;
    out <== signBit;
}

// Main component for compilation
component main {public [minScore]} = CreditScore(700);