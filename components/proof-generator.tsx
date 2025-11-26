"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface ProofGeneratorProps {
  proofType: "snark" | "stark"
}

export default function ProofGenerator({ proofType }: ProofGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [proofData, setProofData] = useState<any>(null)
  const [statement, setStatement] = useState("I know a number x such that x² = 16")
  const [formData, setFormData] = useState({
    userId: 1001,
    age: 21,
    country: "IN",
    salary: 72000,
    creditScore: 735,
    balance: 87000,
    txCount: 35
  })

  // Listen for user data from Dataset Viewer
  useEffect(() => {
    const handleLoadUserData = (event: any) => {
      const user = event.detail
      setFormData({
        userId: user.user_id,
        age: user.age,
        country: user.country,
        salary: user.salary,
        creditScore: user.credit_score,
        balance: user.balance,
        txCount: user.tx_count
      })
    }

    window.addEventListener('loadUserData', handleLoadUserData)
    return () => window.removeEventListener('loadUserData', handleLoadUserData)
  }, [])

  const performanceData = [
    { metric: "Setup Time", snark: 120, stark: 45 },
    { metric: "Proof Gen", snark: 2.5, stark: 8 },
    { metric: "Verification", snark: 0.1, stark: 0.5 },
    { metric: "Proof Size (KB)", snark: 0.288, stark: 150 },
  ]

  const scalabilityData = [
    { computation: "1K gates", snark: 2.5, stark: 3 },
    { computation: "10K gates", snark: 25, stark: 8 },
    { computation: "100K gates", snark: 250, stark: 15 },
    { computation: "1M gates", snark: 2500, stark: 25 },
  ]

  const handleGenerateProof = async () => {
    setIsGenerating(true)

    try {
      // Import API client
      const apiClient = (await import('@/lib/api-client')).default;

      // Construct inputs based on proof type
      const inputs = proofType === 'snark'
        ? {
          creditScore: formData.creditScore,
          salary: formData.salary,
          balance: formData.balance,
          minCreditScore: 700,
          minSalary: 50000,
          minBalance: 10000
        }
        : {
          age: formData.age,
          country: formData.country
        };

      const result = await apiClient.generateProof(proofType, inputs);

      if (result.success && result.data) {
        const data = result.data;
        setProofData({
          type: proofType.toUpperCase(),
          statement: `User ${formData.userId} - ${proofType === 'snark' ? 'Credit Verified' : 'Eligibility Verified'}`,
          proofHash: data.proofId || data.batchId || 'N/A',
          verificationKey: "0x" + Math.random().toString(16).slice(2, 66),
          timestamp: new Date(data.createdAt || Date.now()).toLocaleString(),
          status: data.verified ? "Valid" : "Pending",
          computationTime: proofType === "snark" ? "2.5ms" : "8.2ms",
          proofSize: proofType === "snark" ? "288 bytes" : "156 KB",
          circuitSize: proofType === "snark" ? "50K gates" : "100K gates",
          constraints: proofType === "snark" ? "1,024" : "2,048",
          verificationTime: proofType === "snark" ? "0.1ms" : "0.5ms",
        })
      } else {
        console.error("Proof generation failed:", result.error);
        alert(`Failed to generate proof: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error("Error calling API:", error);
      alert(`Error: ${error.message || 'Failed to connect to backend'}`);
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Interactive Proof Generator</h1>
        <p className="text-muted-foreground mb-8">
          Generate and verify {proofType.toUpperCase()} proofs with real-time metrics
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Generator Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-card border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Proof Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">User Data Input</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="user-id" className="text-xs text-muted-foreground">User ID</label>
                      <input
                        id="user-id"
                        type="number"
                        className="w-full bg-input border border-border rounded p-2 text-sm"
                        placeholder="1001"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) || 0 })}
                        aria-label="User ID"
                        aria-required="false"
                      />
                    </div>
                    <div>
                      <label htmlFor="age" className="text-xs text-muted-foreground">Age (STARK)</label>
                      <input
                        id="age"
                        type="number"
                        className="w-full bg-input border border-border rounded p-2 text-sm"
                        placeholder="21"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                        aria-label="Age for STARK proof"
                        aria-required="false"
                        min="18"
                        max="100"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="text-xs text-muted-foreground">Country (STARK)</label>
                      <input
                        id="country"
                        type="text"
                        className="w-full bg-input border border-border rounded p-2 text-sm"
                        placeholder="IN"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        aria-label="Country code for STARK proof"
                        aria-required="false"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <label htmlFor="salary" className="text-xs text-muted-foreground">Salary (SNARK)</label>
                      <input
                        id="salary"
                        type="number"
                        className="w-full bg-input border border-border rounded p-2 text-sm"
                        placeholder="72000"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) || 0 })}
                        aria-label="Salary for SNARK proof"
                        aria-required="false"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="credit-score" className="text-xs text-muted-foreground">Credit Score (SNARK)</label>
                      <input
                        id="credit-score"
                        type="number"
                        className="w-full bg-input border border-border rounded p-2 text-sm"
                        placeholder="735"
                        value={formData.creditScore}
                        onChange={(e) => setFormData({ ...formData, creditScore: parseInt(e.target.value) || 0 })}
                        aria-label="Credit score for SNARK proof"
                        aria-required="false"
                        min="300"
                        max="850"
                      />
                    </div>
                    <div>
                      <label htmlFor="balance" className="text-xs text-muted-foreground">Balance (SNARK)</label>
                      <input
                        id="balance"
                        type="number"
                        className="w-full bg-input border border-border rounded p-2 text-sm"
                        placeholder="87000"
                        value={formData.balance}
                        onChange={(e) => setFormData({ ...formData, balance: parseInt(e.target.value) || 0 })}
                        aria-label="Account balance for SNARK proof"
                        aria-required="false"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="tx-count" className="text-xs text-muted-foreground">Tx Count (Rollup)</label>
                      <input
                        id="tx-count"
                        type="number"
                        className="w-full bg-input border border-border rounded p-2 text-sm"
                        placeholder="35"
                        value={formData.txCount}
                        onChange={(e) => setFormData({ ...formData, txCount: parseInt(e.target.value) || 0 })}
                        aria-label="Transaction count for Rollup"
                        aria-required="false"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Proof Type</label>
                  <div className="bg-input border border-border rounded-lg p-3 text-sm">{proofType.toUpperCase()}</div>
                </div>

                <Button
                  onClick={handleGenerateProof}
                  disabled={isGenerating}
                  className="w-full bg-primary hover:bg-primary/90"
                  aria-label={isGenerating ? "Generating proof, please wait" : `Generate ${proofType.toUpperCase()} proof`}
                  aria-busy={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Proof"}
                </Button>
              </div>

              {proofData && (
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <h3 className="font-bold text-sm">Proof Details</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-accent font-semibold">{proofData.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{proofData.computationTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{proofData.proofSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Circuit:</span>
                      <span>{proofData.circuitSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Constraints:</span>
                      <span>{proofData.constraints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verify Time:</span>
                      <span>{proofData.verificationTime}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Proof Hash</p>
                    <div className="bg-background rounded p-2 break-all text-xs font-mono text-accent">
                      {proofData.proofHash}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Charts Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Performance Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="metric" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                  <Legend />
                  <Bar dataKey="snark" fill="var(--color-primary)" />
                  <Bar dataKey="stark" fill="var(--color-secondary)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-card border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Scalability Analysis</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scalabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="computation" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="snark" stroke="var(--color-primary)" strokeWidth={2} />
                  <Line type="monotone" dataKey="stark" stroke="var(--color-secondary)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-card border border-border p-6">
              <h2 className="text-xl font-bold mb-4">Proof Generation Flow</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Statement Input</p>
                    <p className="text-xs text-muted-foreground">Define what you want to prove</p>
                  </div>
                </div>
                <div className="h-6 border-l-2 border-border ml-4"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Circuit Compilation</p>
                    <p className="text-xs text-muted-foreground">Convert statement to arithmetic circuit</p>
                  </div>
                </div>
                <div className="h-6 border-l-2 border-border ml-4"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Proof Generation</p>
                    <p className="text-xs text-muted-foreground">Generate cryptographic proof</p>
                  </div>
                </div>
                <div className="h-6 border-l-2 border-border ml-4"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Verification Ready</p>
                    <p className="text-xs text-muted-foreground">Proof can be verified by anyone</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
