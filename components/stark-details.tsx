"use client"

export default function STARKDetails() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-balance">zk-STARKs: Scalable Transparent Arguments of Knowledge</h1>

        <div className="space-y-8">
          {/* Overview */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">What are zk-STARKs?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              zk-STARKs are a newer form of zero-knowledge proofs that address many limitations of SNARKs. They are
              scalable, transparent, and don't require a trusted setup. The acronym stands for:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-secondary mb-2">Scalable</div>
                <p className="text-sm text-muted-foreground">
                  Proof generation and verification scale efficiently with computation size
                </p>
              </div>
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-secondary mb-2">Transparent</div>
                <p className="text-sm text-muted-foreground">No trusted setup required, only public randomness</p>
              </div>
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-secondary mb-2">Arguments</div>
                <p className="text-sm text-muted-foreground">
                  Computationally sound proofs secure against polynomial-time adversaries
                </p>
              </div>
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-secondary mb-2">Knowledge</div>
                <p className="text-sm text-muted-foreground">Proves knowledge of a witness without revealing it</p>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">How zk-STARKs Work</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Computation Trace</h3>
                  <p className="text-muted-foreground">
                    The prover creates a trace of the computation they want to prove, showing each step.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Polynomial Commitment</h3>
                  <p className="text-muted-foreground">
                    The trace is committed to using polynomial commitments (no trusted setup needed).
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Interactive Verification</h3>
                  <p className="text-muted-foreground">
                    The verifier challenges the prover with random queries to verify the computation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Fiat-Shamir Transform</h3>
                  <p className="text-muted-foreground">
                    The interactive protocol is converted to non-interactive using hash functions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Characteristics */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Key Characteristics</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <div>
                  <strong>Proof Size:</strong> Larger than SNARKs (100-200 KB), but still practical
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <div>
                  <strong>No Trusted Setup:</strong> Only requires public randomness, eliminating setup risks
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <div>
                  <strong>Post-Quantum Secure:</strong> Resistant to quantum computing attacks
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <div>
                  <strong>Scalability:</strong> Proof generation and verification scale well with computation size
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">•</span>
                <div>
                  <strong>Transparency:</strong> All parameters are public and verifiable
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Applications */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Real-World Applications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-secondary mb-2">StarkNet</h3>
                <p className="text-sm text-muted-foreground">
                  Ethereum Layer 2 scaling solution using STARKs for efficient transaction batching
                </p>
              </div>
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-secondary mb-2">Immutable X</h3>
                <p className="text-sm text-muted-foreground">
                  NFT marketplace leveraging STARKs for scalable and private transactions
                </p>
              </div>
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-secondary mb-2">Computational Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  Proving correct execution of complex computations without re-execution
                </p>
              </div>
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-secondary mb-2">Blockchain Validation</h3>
                <p className="text-sm text-muted-foreground">
                  Efficient verification of blockchain state and transaction history
                </p>
              </div>
            </div>
          </div>

          {/* Advantages vs Disadvantages */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-secondary">Advantages</h2>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>No trusted setup required</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Post-quantum secure</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Transparent and verifiable</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary">✓</span>
                  <span>Scales well with computation</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-destructive">Disadvantages</h2>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Larger proof sizes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Slower verification than SNARKs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Newer technology, less proven</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>More complex implementation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
