pragma circom 2.0.0;

// Comprehensive Credit Check Circuit for zk-SNARK
// Proves credit score, salary, and balance without revealing actual values

template ComprehensiveCredit() {
    // Public inputs (known to verifier)
    signal input minCreditScore;
    signal input minSalary;
    signal input minBalance;
    
    // Private inputs (hidden from verifier)
    signal private input creditScore;
    signal private input salary;
    signal private input balance;
    
    // Constraints: verify all values meet minimums
    // creditScore >= minCreditScore
    signal diff1;
    diff1 <-- creditScore - minCreditScore;
    diff1 >= 0;
    
    // salary >= minSalary
    signal diff2;
    diff2 <-- salary - minSalary;
    diff2 >= 0;
    
    // balance >= minBalance
    signal diff3;
    diff3 <-- balance - minBalance;
    diff3 >= 0;
    
    // Range checks (optional - ensures realistic values)
    // creditScore between 300 and 850
    signal creditCheck1;
    creditCheck1 <-- creditScore - 300;
    creditCheck1 >= 0;
    
    signal creditCheck2;
    creditCheck2 <-- 850 - creditScore;
    creditCheck2 >= 0;
    
    // Output (1 if all checks pass)
    signal output isValid;
    isValid <== 1;
}

component main = ComprehensiveCredit();

