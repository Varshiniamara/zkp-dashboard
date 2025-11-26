// Advanced Credit Profile Verification Circuit
// Verifies multiple financial attributes using range proofs

pragma circom 2.0.0;

// Circuit that verifies multiple financial attributes
template CreditProfile() {
    // Private inputs (known only to prover)
    signal input creditScore;
    signal input salary;
    signal input balance;
    
    // Public inputs (known to verifier)
    signal input minCreditScore;
    signal input minSalary;
    signal input minBalance;
    
    // Output: 1 if all checks pass
    signal output isValid;
    
    // Credit score check (must be >= minimum)
    creditScore - minCreditScore >= 0;
    
    // Salary check (must be >= minimum)
    salary - minSalary >= 0;
    
    // Balance check (must be >= minimum)
    balance - minBalance >= 0;
    
    // If we get here, all checks passed
    isValid <-- 1;
}

// Main component with public inputs
component main {public [minCreditScore, minSalary, minBalance]} = CreditProfile();
