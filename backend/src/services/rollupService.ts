import crypto from 'crypto';

interface RollupTransaction {
    userId: number;
    creditScore: number;
    salary: number;
    balance: number;
}

interface BatchProof {
    batchId: string;
    timestamp: number;
    previousStateRoot: string;
    newStateRoot: string;
    transactionCount: number;
    invalidTransactionCount: number;
    invalidTransactions: number[];
    proofData: string;
    isValid: boolean;
}

export class RollupService {
    // Simulate a state root
    private currentStateRoot: string = crypto.createHash('sha256').update('genesis').digest('hex');

    public async processBatch(transactions: RollupTransaction[]): Promise<BatchProof> {
        console.log(`Processing batch of ${transactions.length} transactions...`);

        const previousStateRoot = this.currentStateRoot;

        // 1. Verify each transaction (Simulate L2 checks)
        const validTransactions: RollupTransaction[] = [];
        const invalidTransactions: number[] = [];

        transactions.forEach(tx => {
            // Stricter logic: Credit Score >= 700
            if (tx.creditScore >= 700) {
                validTransactions.push(tx);
            } else {
                invalidTransactions.push(tx.userId);
            }
        });

        // 2. Update State (Calculate new Merkle Root)
        // We hash the transactions to get the new root
        const leaves = validTransactions.map(tx =>
            crypto.createHash('sha256').update(`${tx.userId}-${tx.creditScore}-${tx.salary}-${tx.balance}`).digest('hex')
        );
        const newStateRoot = this.merkleRoot(leaves);

        // 3. Generate Batch Proof (Simulated SNARK proof of the batch)
        const batchId = crypto.randomUUID();
        const proofData = `zk-rollup-proof-${batchId}-${newStateRoot.substring(0, 10)}`;

        // Update local state
        this.currentStateRoot = newStateRoot;

        return {
            batchId,
            timestamp: Date.now(),
            previousStateRoot,
            newStateRoot,
            transactionCount: validTransactions.length,
            invalidTransactionCount: invalidTransactions.length,
            invalidTransactions,
            proofData,
            isValid: true
        };
    }

    public async verifyBatch(proof: BatchProof): Promise<boolean> {
        // In a real rollup, the L1 contract verifies this proof
        // Here we simulate the verification
        console.log('Verifying Batch Proof:', proof.batchId);

        // Check if proof format is valid
        if (!proof.proofData.startsWith('zk-rollup-proof-')) return false;

        return true;
    }

    private merkleRoot(leaves: string[]): string {
        if (leaves.length === 0) return crypto.createHash('sha256').update('empty').digest('hex');
        if (leaves.length === 1) return leaves[0];

        const nextLevel: string[] = [];
        for (let i = 0; i < leaves.length; i += 2) {
            const left = leaves[i];
            const right = i + 1 < leaves.length ? leaves[i + 1] : left; // Duplicate last if odd
            const hash = crypto.createHash('sha256').update(left + right).digest('hex');
            nextLevel.push(hash);
        }
        return this.merkleRoot(nextLevel);
    }
}

export const rollupService = new RollupService();
