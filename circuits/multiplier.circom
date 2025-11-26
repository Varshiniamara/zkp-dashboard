// This circuit checks that c is the multiplication of a and b
pragma circom 2.0.0;

template Multiplier() {
    signal private input a;
    signal private input b;
    signal output c;

    // Constraint: c = a * b
    c <== a * b;
}

component main = Multiplier();
