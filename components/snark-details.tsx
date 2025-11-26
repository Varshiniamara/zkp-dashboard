"use client"

export default function SNARKDetails() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-balance">
          zk-SNARKs: Succinct Non-Interactive Arguments of Knowledge
        </h1>

        <div className="space-y-8">
          {/* Overview */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">What are zk-SNARKs?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              zk-SNARKs are cryptographic proofs that allow one party (the prover) to prove possession of certain
              information to another party (the verifier) without revealing the information itself. The acronym stands
              for:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-primary mb-2">Succinct</div>
                <p className="text-sm text-muted-foreground">
                  Proofs are very small, typically just a few hundred bytes
                </p>
              </div>
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-primary mb-2">Non-Interactive</div>
                <p className="text-sm text-muted-foreground">
                  No back-and-forth communication needed between prover and verifier
                </p>
              </div>
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-primary mb-2">Arguments</div>
                <p className="text-sm text-muted-foreground">
                  Computationally sound proofs (secure against polynomial-time adversaries)
                </p>
              </div>
              <div className="bg-background rounded p-4 border border-border">
                <div className="font-semibold text-primary mb-2">Knowledge</div>
                <p className="text-sm text-muted-foreground">Proves knowledge of a witness without revealing it</p>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">How zk-SNARKs Work</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Setup Phase</h3>
                  <p className="text-muted-foreground">
                    A trusted setup ceremony generates public parameters. This is a one-time process but requires trust.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Proof Generation</h3>
                  <p className="text-muted-foreground">
                    The prover uses the public parameters and their secret witness to generate a compact proof.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Proof Verification</h3>
                  <p className="text-muted-foreground">
                    The verifier checks the proof using public parameters. Verification is fast and doesn't require the
                    witness.
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
                <span className="text-accent font-bold mt-1">•</span>
                <div>
                  <strong>Proof Size:</strong> Approximately 288 bytes, making them extremely compact
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">•</span>
                <div>
                  <strong>Verification Time:</strong> Milliseconds, enabling real-time verification
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">•</span>
                <div>
                  <strong>Trusted Setup:</strong> Requires a one-time trusted setup ceremony (potential security
                  concern)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">•</span>
                <div>
                  <strong>Quantum Vulnerability:</strong> Not resistant to quantum computing attacks
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold mt-1">•</span>
                <div>
                  <strong>Maturity:</strong> Well-established with proven implementations
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Applications */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Real-World Applications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-primary mb-2">Zcash</h3>
                <p className="text-sm text-muted-foreground">
                  Private cryptocurrency transactions using zk-SNARKs to hide sender, receiver, and transaction amount
                </p>
              </div>
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-primary mb-2">Ethereum Layer 2</h3>
                <p className="text-sm text-muted-foreground">
                  zk-rollups bundle multiple transactions into a single proof for scalability
                </p>
              </div>
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-primary mb-2">Identity Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Prove credentials or attributes without revealing personal information
                </p>
              </div>
              <div className="border border-border rounded p-4">
                <h3 className="font-semibold text-primary mb-2">Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Prove regulatory compliance without exposing sensitive business data
                </p>
              </div>
            </div>
          </div>

          {/* Advantages vs Disadvantages */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-accent">Advantages</h2>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Extremely compact proofs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Very fast verification</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Proven in production</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Efficient for simple statements</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-destructive">Disadvantages</h2>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Requires trusted setup</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Not quantum-resistant</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Complex to implement</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">✗</span>
                  <span>Longer proof generation time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
