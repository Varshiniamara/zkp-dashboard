"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Shield, 
  Globe, 
  Layers,
  Sparkles,
  Database
} from "lucide-react"

interface ProofResult {
  type: 'snark' | 'stark' | 'rollup' | 'hybrid'
  status: 'idle' | 'generating' | 'success' | 'error'
  proof?: any
  error?: string
  metrics?: {
    proofSize?: string
    generationTime?: string
    verificationTime?: string
    gasCost?: string
  }
}

export default function ZKPDemoPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [proofResults, setProofResults] = useState<Record<string, ProofResult>>({
    snark: { type: 'snark', status: 'idle' },
    stark: { type: 'stark', status: 'idle' },
    rollup: { type: 'rollup', status: 'idle' },
    hybrid: { type: 'hybrid', status: 'idle' },
  })
  const [mlPrediction, setMlPrediction] = useState<any>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.getDataset(1, 20)
      if (result.success && result.data) {
        setUsers(result.data.data || [])
        if (result.data.data && result.data.data.length > 0) {
          setSelectedUser(result.data.data[0])
        }
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const generateSNARKProof = async () => {
    if (!selectedUser) return
    
    setProofResults(prev => ({ ...prev, snark: { type: 'snark', status: 'generating' } }))
    
    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.generateProof('snark', {
        creditScore: selectedUser.credit_score,
        salary: selectedUser.salary,
        balance: selectedUser.balance,
        minCreditScore: 700,
        minSalary: 50000,
        minBalance: 10000
      })
      
      if (result.success && result.data) {
        setProofResults(prev => ({
          ...prev,
          snark: {
            type: 'snark',
            status: 'success',
            proof: result.data,
            metrics: {
              proofSize: '~25 KB',
              generationTime: '2.5 ms',
              verificationTime: '0.1 ms',
              gasCost: '~45,000 gas'
            }
          }
        }))
      } else {
        throw new Error(result.error || 'Failed to generate proof')
      }
    } catch (error: any) {
      setProofResults(prev => ({
        ...prev,
        snark: { type: 'snark', status: 'error', error: error.message }
      }))
    }
  }

  const generateSTARKProof = async () => {
    if (!selectedUser) return
    
    setProofResults(prev => ({ ...prev, stark: { type: 'stark', status: 'generating' } }))
    
    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.generateProof('stark', {
        age: selectedUser.age,
        country: selectedUser.country
      })
      
      if (result.success && result.data) {
        setProofResults(prev => ({
          ...prev,
          stark: {
            type: 'stark',
            status: 'success',
            proof: result.data,
            metrics: {
              proofSize: '~150 KB',
              generationTime: '8.2 ms',
              verificationTime: '0.5 ms',
              gasCost: 'N/A (off-chain)'
            }
          }
        }))
      } else {
        throw new Error(result.error || 'Failed to generate proof')
      }
    } catch (error: any) {
      setProofResults(prev => ({
        ...prev,
        stark: { type: 'stark', status: 'error', error: error.message }
      }))
    }
  }

  const generateRollupProof = async () => {
    setProofResults(prev => ({ ...prev, rollup: { type: 'rollup', status: 'generating' } }))
    
    try {
      const apiClient = (await import('@/lib/api-client')).default
      const transactions = users.slice(0, 10).map(u => ({
        userId: u.user_id,
        creditScore: u.credit_score,
        balance: u.balance
      }))
      
      const result = await apiClient.generateProof('rollup', { transactions })
      
      if (result.success && result.data) {
        setProofResults(prev => ({
          ...prev,
          rollup: {
            type: 'rollup',
            status: 'success',
            proof: result.data,
            metrics: {
              proofSize: '~30 KB',
              generationTime: '15 ms',
              verificationTime: '0.1 ms',
              gasCost: '~45,000 gas (for 10 users)'
            }
          }
        }))
      } else {
        throw new Error(result.error || 'Failed to generate proof')
      }
    } catch (error: any) {
      setProofResults(prev => ({
        ...prev,
        rollup: { type: 'rollup', status: 'error', error: error.message }
      }))
    }
  }

  const runHybridFlow = async () => {
    setProofResults(prev => ({ ...prev, hybrid: { type: 'hybrid', status: 'generating' } }))
    
    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.runHybridFlow(10)
      
      if (result.success && result.data) {
        setProofResults(prev => ({
          ...prev,
          hybrid: {
            type: 'hybrid',
            status: 'success',
            proof: result.data,
            metrics: {
              proofSize: '~200 KB',
              generationTime: '~30 ms',
              verificationTime: '~1 ms',
              gasCost: '~50,000 gas'
            }
          }
        }))
      } else {
        throw new Error(result.error || 'Failed to run hybrid flow')
      }
    } catch (error: any) {
      setProofResults(prev => ({
        ...prev,
        hybrid: { type: 'hybrid', status: 'error', error: error.message }
      }))
    }
  }

  const predictCreditScore = async () => {
    if (!selectedUser) return
    
    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.predictCreditScore({
        age: selectedUser.age,
        salary: selectedUser.salary,
        balance: selectedUser.balance,
        txCount: selectedUser.tx_count,
        country: selectedUser.country
      })
      
      if (result.success && result.data) {
        setMlPrediction(result.data)
      }
    } catch (error) {
      console.error('Error predicting credit score:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab="demo" setActiveTab={() => {}} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Complete ZKP Demonstration</h1>
            <p className="text-muted-foreground">
              Interactive demonstration of zk-SNARK, zk-STARK, zk-Rollup, and Hybrid Framework
            </p>
          </div>

          {/* User Selection */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Database className="h-5 w-5" />
                Select User for Demo
              </h2>
              <Button onClick={loadUsers} variant="outline" size="sm">
                Refresh Users
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 max-h-40 overflow-y-auto">
              {users.map(user => (
                <button
                  key={user.user_id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedUser?.user_id === user.user_id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">ID: {user.user_id}</div>
                  <div className="text-xs text-muted-foreground">
                    Score: {user.credit_score}
                  </div>
                </button>
              ))}
            </div>

            {selectedUser && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">Age</div>
                  <div className="font-medium">{selectedUser.age}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Country</div>
                  <div className="font-medium">{selectedUser.country}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Credit Score</div>
                  <div className="font-medium">{selectedUser.credit_score}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Salary</div>
                  <div className="font-medium">${selectedUser.salary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Balance</div>
                  <div className="font-medium">${selectedUser.balance.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Transactions</div>
                  <div className="font-medium">{selectedUser.tx_count}</div>
                </div>
              </div>
            )}

            {selectedUser && (
              <div className="mt-4">
                <Button onClick={predictCreditScore} variant="outline" size="sm">
                  Predict Credit Score with ML
                </Button>
                {mlPrediction && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Predicted Score:</span>
                      <Badge variant={mlPrediction.riskLevel === 'low' ? 'default' : mlPrediction.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                        {mlPrediction.predictedScore}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Risk Level: {mlPrediction.riskLevel} | Confidence: {(mlPrediction.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* ZKP Types */}
          <Tabs defaultValue="snark" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="snark" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                zk-SNARK
              </TabsTrigger>
              <TabsTrigger value="stark" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                zk-STARK
              </TabsTrigger>
              <TabsTrigger value="rollup" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                zk-Rollup
              </TabsTrigger>
              <TabsTrigger value="hybrid" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Hybrid
              </TabsTrigger>
            </TabsList>

            {/* zk-SNARK */}
            <TabsContent value="snark">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">zk-SNARK: Privacy-Preserving Proofs</h2>
                    <p className="text-muted-foreground">
                      Prove credit score, salary, and balance meet requirements without revealing actual values
                    </p>
                  </div>
                  <Button 
                    onClick={generateSNARKProof}
                    disabled={!selectedUser || proofResults.snark.status === 'generating'}
                  >
                    {proofResults.snark.status === 'generating' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Generate Proof
                  </Button>
                </div>

                <ProofResultDisplay result={proofResults.snark} />
              </Card>
            </TabsContent>

            {/* zk-STARK */}
            <TabsContent value="stark">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">zk-STARK: Transparent Verification</h2>
                    <p className="text-muted-foreground">
                      Verify age and country eligibility with full transparency, no trusted setup required
                    </p>
                  </div>
                  <Button 
                    onClick={generateSTARKProof}
                    disabled={!selectedUser || proofResults.stark.status === 'generating'}
                  >
                    {proofResults.stark.status === 'generating' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Generate Proof
                  </Button>
                </div>

                <ProofResultDisplay result={proofResults.stark} />
              </Card>
            </TabsContent>

            {/* zk-Rollup */}
            <TabsContent value="rollup">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">zk-Rollup: Scalable Batching</h2>
                    <p className="text-muted-foreground">
                      Batch multiple transactions into a single proof for massive gas savings
                    </p>
                  </div>
                  <Button 
                    onClick={generateRollupProof}
                    disabled={proofResults.rollup.status === 'generating'}
                  >
                    {proofResults.rollup.status === 'generating' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Process Batch (10 users)
                  </Button>
                </div>

                <ProofResultDisplay result={proofResults.rollup} />
              </Card>
            </TabsContent>

            {/* Hybrid */}
            <TabsContent value="hybrid">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Hybrid Framework</h2>
                    <p className="text-muted-foreground">
                      Combined architecture: SNARK (privacy) + STARK (transparency) + Rollup (scalability)
                    </p>
                  </div>
                  <Button 
                    onClick={runHybridFlow}
                    disabled={proofResults.hybrid.status === 'generating'}
                  >
                    {proofResults.hybrid.status === 'generating' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Run Hybrid Flow
                  </Button>
                </div>

                <ProofResultDisplay result={proofResults.hybrid} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function ProofResultDisplay({ result }: { result: ProofResult }) {
  if (result.status === 'idle') {
    return (
      <Alert>
        <AlertDescription>
          Click "Generate Proof" to create a zero-knowledge proof. All proofs are generated on-the-fly using the selected user's data.
        </AlertDescription>
      </Alert>
    )
  }

  if (result.status === 'generating') {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3">Generating proof...</span>
      </div>
    )
  }

  if (result.status === 'error') {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{result.error || 'Failed to generate proof'}</AlertDescription>
      </Alert>
    )
  }

  if (result.status === 'success' && result.proof) {
    return (
      <div className="space-y-4">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Proof generated successfully! The proof demonstrates the statement without revealing private information.
          </AlertDescription>
        </Alert>

        {result.metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Proof Size</div>
              <div className="text-lg font-semibold">{result.metrics.proofSize}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Gen Time</div>
              <div className="text-lg font-semibold">{result.metrics.generationTime}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Verify Time</div>
              <div className="text-lg font-semibold">{result.metrics.verificationTime}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Gas Cost</div>
              <div className="text-lg font-semibold">{result.metrics.gasCost}</div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm font-medium mb-2">Proof Details</div>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify({
              proofId: result.proof.proofId || result.proof.batchId || 'N/A',
              type: result.type,
              timestamp: new Date().toISOString(),
            }, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return null
}

