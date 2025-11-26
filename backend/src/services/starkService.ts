import crypto from 'crypto';

interface StarkInput {
    age: number;
    country: string;
}

interface StarkProof {
    proofId: string;
    timestamp: number;
    publicInputs: StarkInput;
    traceRoot: string;
    friLayers: string[];
    proofHash: string;
    isValid: boolean;
}

export class StarkService {
    private allowedCountries = ['IN', 'US', 'CA'];

    // Generate a STARK proof (Simulated)
    public async generateProof(input: StarkInput): Promise<StarkProof> {
        console.log('Generating STARK proof for:', input);

        // 1. Validate inputs (Constraint checking)
        const isEligible = input.age >= 18 && this.allowedCountries.includes(input.country);

        // 2. Generate Execution Trace (Simulation)
        // In a real STARK, this would be the trace of the computation
        const trace = Array.from({ length: 10 }, (_, i) =>
            crypto.createHash('sha256').update(`trace-${i}-${input.age}-${input.country}`).digest('hex')
        );
        const traceRoot = this.merkleRoot(trace);

        // 3. Generate FRI Layers (Simulation)
        const friLayers = Array.from({ length: 5 }, (_, i) =>
            crypto.createHash('sha256').update(`fri-${i}-${traceRoot}`).digest('hex')
        );

        // 4. Construct Proof
        const proofId = crypto.randomUUID();
        const timestamp = Date.now();

        // The proof hash binds the inputs and the trace
        const proofHash = crypto.createHash('sha256')
            .update(`${proofId}-${JSON.stringify(input)}-${traceRoot}`)
            .digest('hex');

        return {
            proofId,
            timestamp,
            publicInputs: input,
            traceRoot,
            friLayers,
            proofHash,
            isValid: isEligible // In a real system, this is implicitly true if proof generates
        };
    }

    // Verify a STARK proof
    public async verifyProof(proof: StarkProof): Promise<boolean> {
        console.log('Verifying STARK proof:', proof.proofId);

        // 1. Recompute Trace Root (Simulation of verifying constraints)
        // In reality, we verify the Merkle paths and FRI layers
        const trace = Array.from({ length: 10 }, (_, i) =>
            crypto.createHash('sha256').update(`trace-${i}-${proof.publicInputs.age}-${proof.publicInputs.country}`).digest('hex')
        );
        const calculatedRoot = this.merkleRoot(trace);

        if (calculatedRoot !== proof.traceRoot) {
            console.error('Trace root mismatch');
            return false;
        }

        // 2. Check Eligibility Logic (The "Program")
        const { age, country } = proof.publicInputs;
        const isEligible = age >= 18 && this.allowedCountries.includes(country);

        return isEligible;
    }

    private merkleRoot(leaves: string[]): string {
        if (leaves.length === 0) return '';
        if (leaves.length === 1) return leaves[0];

        const nextLevel: string[] = [];
        for (let i = 0; i < leaves.length; i += 2) {
            const left = leaves[i];
            const right = i + 1 < leaves.length ? leaves[i + 1] : '';
            const hash = crypto.createHash('sha256').update(left + right).digest('hex');
            nextLevel.push(hash);
        }
        return this.merkleRoot(nextLevel);
    }
}

export const starkService = new StarkService();
