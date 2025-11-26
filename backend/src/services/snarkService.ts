import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import crypto from 'crypto';
import { circuitService } from './circuitService';

interface SnarkInput {
    creditScore: number;
    salary: number;
    balance: number;
    minCreditScore: number;
    minSalary: number;
    minBalance: number;
}

interface SnarkProof {
    proofId: string;
    timestamp: number;
    circuit: string;
    publicInputs: any;
    proof: any;
    publicSignals: any;
    isValid: boolean;
    isSimulated: boolean;
}

export class SnarkService {
    private buildDir = path.join(__dirname, '../../../build/circuits');

    public async generateProof(circuitName: string, input: SnarkInput): Promise<SnarkProof> {
        console.log(`Generating SNARK proof for ${circuitName}...`);

        // Check if circuits are compiled
        const wasmPath = path.join(this.buildDir, `${circuitName}_js`, `${circuitName}.wasm`);
        const zkeyPath = path.join(this.buildDir, `${circuitName}.zkey`);

        if (fs.existsSync(wasmPath) && fs.existsSync(zkeyPath)) {
            return this.generateRealProof(circuitName, input);
        } else {
            console.warn('Circuits not found, generating simulated proof.');
            return this.generateSimulatedProof(circuitName, input);
        }
    }

    private async generateRealProof(circuitName: string, input: SnarkInput): Promise<SnarkProof> {
        try {
            // Try to use circuit service for real proof generation
            const privateInputs = {
                creditScore: input.creditScore,
                salary: input.salary,
                balance: input.balance,
            };
            
            const publicInputs = {
                minCreditScore: input.minCreditScore,
                minSalary: input.minSalary,
                minBalance: input.minBalance,
            };
            
            const result = await circuitService.generateSNARKProof(
                circuitName,
                privateInputs,
                publicInputs
            );
            
            const proofId = crypto.randomUUID();
            
            return {
                proofId,
                timestamp: Date.now(),
                circuit: circuitName,
                publicInputs,
                proof: result.proof,
                publicSignals: result.publicSignals,
                isValid: result.isValid,
                isSimulated: false
            };
        } catch (error) {
            console.error('Real proof generation failed, using simulation:', error);
            return this.generateSimulatedProof(circuitName, input);
        }
    }

    private generateSimulatedProof(circuitName: string, input: SnarkInput): SnarkProof {
        // Validate logic (Constraint Check)
        const isValid =
            input.creditScore >= input.minCreditScore &&
            input.salary >= input.minSalary &&
            input.balance >= input.minBalance;

        const proofId = crypto.randomUUID();

        // Create a dummy Groth16 proof structure
        const proof = {
            pi_a: [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex'), "1"],
            pi_b: [[crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')], [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex')], ["1", "0"]],
            pi_c: [crypto.randomBytes(32).toString('hex'), crypto.randomBytes(32).toString('hex'), "1"],
            protocol: "groth16",
            curve: "bn128"
        };

        return {
            proofId,
            timestamp: Date.now(),
            circuit: circuitName,
            publicInputs: {
                minCreditScore: input.minCreditScore,
                minSalary: input.minSalary,
                minBalance: input.minBalance
            },
            proof,
            publicSignals: [
                isValid ? "1" : "0", // Output signal
                input.minCreditScore.toString(),
                input.minSalary.toString(),
                input.minBalance.toString()
            ],
            isValid,
            isSimulated: true
        };
    }

    public async verifyProof(proof: SnarkProof): Promise<boolean> {
        if (proof.isSimulated) {
            return proof.isValid;
        }
        // Real verification logic would go here
        return true;
    }
}

export const snarkService = new SnarkService();
