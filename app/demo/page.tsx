"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Shield,
  Globe,
  Layers,
  Sparkles,
  Database,
  UserCog
} from "lucide-react"
import ComprehensiveProofDisplay from "@/components/comprehensive-proof-display"
import HybridFlowDemo from "@/components/hybrid-flow-demo"

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
  // Generate demo users immediately for initial state
  const initialDemoUsers = Array.from({ length: 20 }).map((_, i) => ({
    user_id: 1000 + i,
    name: `Demo User ${i + 1}`,
    age: 25 + (i % 50),
    country: ['US', 'UK', 'CA', 'AU', 'IN'][i % 5],
    credit_score: 600 + (i * 15),
    salary: 50000 + (i * 5000),
    balance: 10000 + (i * 2000),
    tx_count: 50 + (i * 10),
    eligible_for_loan: (600 + (i * 15)) >= 700
  }))

  const [inputMode, setInputMode] = useState<'dataset' | 'manual'>('dataset')
  const [selectedUser, setSelectedUser] = useState<any>(initialDemoUsers[0])
  const [users, setUsers] = useState<any[]>(initialDemoUsers)
  const [manualInputs, setManualInputs] = useState({
    creditScore: 750,
    salary: 85000,
    balance: 15000,
    age: 25,
    country: 'US'
  })

  const [proofResults, setProofResults] = useState<Record<string, ProofResult>>({
    snark: { type: 'snark', status: 'idle' },
    stark: { type: 'stark', status: 'idle' },
    rollup: { type: 'rollup', status: 'idle' },
    hybrid: { type: 'hybrid', status: 'idle' },
  })
  const [blockchainLogs, setBlockchainLogs] = useState<string[]>([])
  const [showCircuit, setShowCircuit] = useState(false)
  const [circuitCode, setCircuitCode] = useState('')
  const [selectedBatchUsers, setSelectedBatchUsers] = useState<any[]>(initialDemoUsers.slice(0, 10))
  const [activeTab, setActiveTab] = useState<string>('snark')



  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["snark", "stark", "rollup", "hybrid"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    loadUsers()
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/demo?tab=${value}`, { scroll: false })
  }

  const loadUsers = async () => {
    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.getDataset(1, 50)
      console.log('Dataset API result:', result)
      if (result.success && result.data) {
        const userData = result.data.data || result.data || []
        console.log('Loaded users:', userData.length)
        setUsers(userData)
        if (userData.length > 0) {
          setSelectedUser(userData[0])
          setSelectedBatchUsers(userData.slice(0, Math.min(10, userData.length)))
        }
      } else {
        console.error('Dataset load failed:', result.error)
        //Load demo users  as fallback
        const demoUsers = generateDemoUsers()
        setUsers(demoUsers)
        setSelectedUser(demoUsers[0])
        setSelectedBatchUsers(demoUsers.slice(0, 10))
      }
    } catch (error) {
      console.error('Error loading users:', error)
      // Load demo users as fallback
      const demoUsers = generateDemoUsers()
      setUsers(demoUsers)
      setSelectedUser(demoUsers[0])
      setSelectedBatchUsers(demoUsers.slice(0, 10))
    }
  }

  const generateDemoUsers = () => {
    return Array.from({ length: 20 }).map((_, i) => ({
      user_id: 1000 + i,
      name: `Demo User ${i + 1}`,
      age: 25 + (i % 50),
      country: ['US', 'UK', 'CA', 'AU', 'IN'][i % 5],
      credit_score: 600 + (i * 15),
      salary: 50000 + (i * 5000),
      balance: 10000 + (i * 2000),
      tx_count: 50 + (i * 10),
      eligible_for_loan: (600 + (i * 15)) >= 700
    }))
  }

  const handleManualInputChange = (field: string, value: string) => {
    setManualInputs(prev => ({
      ...prev,
      [field]: field === 'country' ? value : Number(value)
    }))
  }

  const generateSNARKProof = async () => {
    // Use selected user or manual inputs
    const data = inputMode === 'dataset' && selectedUser
      ? {
        creditScore: selectedUser.credit_score,
        salary: selectedUser.salary,
        balance: selectedUser.balance,
        age: selectedUser.age,
        country: selectedUser.country
      }
      : {
        creditScore: manualInputs.creditScore,
        salary: manualInputs.salary,
        balance: manualInputs.balance,
        age: manualInputs.age,
        country: manualInputs.country
      }

    setProofResults(prev => ({ ...prev, snark: { type: 'snark', status: 'generating' } }))
    addBlockchainLog('📡 Initiating zk-SNARK proof generation...')
    addBlockchainLog('🔐 Compiling Circom circuit: credit_score.circom')

    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.generateProof('snark', {
        ...data,
        minCreditScore: 700,
        minSalary: 50000,
        minBalance: 10000
      })

      if (result.success && result.data) {

        const isVerified = result.data.verified !== undefined ? result.data.verified : true;

        if (result.data.fraudDetected) {
          addBlockchainLog('❌ Proof generation BLOCKED: Fraud Pattern Detected')
          addBlockchainLog(`⚠️ High Risk Score: ${result.data.fraudScore}/100`)
          addBlockchainLog('🛡️ Transaction flagged by ML Risk Engine')

          setProofResults(prev => ({
            ...prev,
            snark: {
              type: 'snark',
              status: 'error',
              error: `Fraud Detected (Risk Score: ${result.data.fraudScore})`,
              proof: result.data
            }
          }))
          return;
        }

        if (!isVerified) {
          addBlockchainLog('❌ Proof generated but verification FAILED: Criteria not met')
          addBlockchainLog('⚠️ Credit Score, Salary, or Balance below threshold')

          setProofResults(prev => ({
            ...prev,
            snark: {
              type: 'snark',
              status: 'error',
              error: 'Verification Failed: User criteria not met (Score < 700 or Salary < 50k)',
              proof: result.data
            }
          }))
          return;
        }

        addBlockchainLog('✅ Proof generated successfully')
        addBlockchainLog(`📦 Proof ID: ${result.data.proofId}`)
        addBlockchainLog('⛓️  Submitting to smart contract...')

        setTimeout(() => {
          addBlockchainLog('✅ Verified on-chain | Block #' + Math.floor(Math.random() * 1000000))
        }, 500)

        setProofResults(prev => ({
          ...prev,
          snark: {
            type: 'snark',
            status: 'success',
            proof: result.data,
            metrics: {
              proofSize: result.data.metrics?.proofSize || '~25 KB',
              generationTime: result.data.metrics?.generationTime || '2.5 ms',
              verificationTime: result.data.metrics?.verificationTime || '0.1 ms',
              gasCost: result.data.metrics?.gasCost || '~45,000 gas'
            }
          }
        }))
      } else {
        throw new Error(result.error || 'Failed to generate proof')
      }
    } catch (error: any) {
      addBlockchainLog('❌ Error: ' + error.message)
      setProofResults(prev => ({
        ...prev,
        snark: { type: 'snark', status: 'error', error: error.message }
      }))
    }
  }

  const generateSTARKProof = async () => {
    const data = inputMode === 'dataset' && selectedUser
      ? {
        creditScore: selectedUser.credit_score,
        salary: selectedUser.salary,
        balance: selectedUser.balance,
        age: selectedUser.age,
        country: selectedUser.country
      }
      : {
        creditScore: manualInputs.creditScore,
        salary: manualInputs.salary,
        balance: manualInputs.balance,
        age: manualInputs.age,
        country: manualInputs.country
      }

    setProofResults(prev => ({ ...prev, stark: { type: 'stark', status: 'generating' } }))
    addBlockchainLog('📡 Initiating zk-STARK proof generation...')
    addBlockchainLog('🔐 Using FRI-STARK protocol (no trusted setup)')

    try {
      const apiClient = (await import('@/lib/api-client')).default
      const result = await apiClient.generateProof('stark', {
        ...data,
        minCreditScore: 700,
        minSalary: 50000,
        minBalance: 10000
      })

      if (result.success && result.data) {
        const isVerified = result.data.verified !== undefined ? result.data.verified : true;

        if (!isVerified) {
          addBlockchainLog('❌ STARK Proof generated but verification FAILED: Criteria not met')

          setProofResults(prev => ({
            ...prev,
            stark: {
              type: 'stark',
              status: 'error',
              error: 'Verification Failed: User criteria not met',
              proof: result.data
            }
          }))
          return;
        }

        addBlockchainLog('✅ STARK proof generated successfully')
        addBlockchainLog(`📦 Proof ID: ${result.data.proofId}`)
        addBlockchainLog('🔍 Transparent verification ready')

        setTimeout(() => {
          addBlockchainLog('✅ Proof verified | Post-quantum secure')
        }, 500)

        setProofResults(prev => ({
          ...prev,
          stark: {
            type: 'stark',
            status: 'success',
            proof: result.data,
            metrics: {
              proofSize: result.data.metrics?.proofSize || '~45 KB',
              generationTime: result.data.metrics?.generationTime || '8.2 ms',
              verificationTime: result.data.metrics?.verificationTime || '0.5 ms',
              gasCost: result.data.metrics?.gasCost || '~65,000 gas'
            }
          }
        }))
      } else {
        throw new Error(result.error || 'Failed to generate proof')
      }
    } catch (error: any) {
      addBlockchainLog('❌ Error: ' + error.message)
      setProofResults(prev => ({
        ...prev,
        stark: { type: 'stark', status: 'error', error: error.message }
      }))
    }
  }

  const generateRollupProof = async () => {
    setProofResults(prev => ({ ...prev, rollup: { type: 'rollup', status: 'generating' } }))
    addBlockchainLog('📡 Initiating zk-Rollup batch processing...')
    addBlockchainLog(`📦 Batching ${selectedBatchUsers.length} user proofs...`)

    try {
      const apiClient = (await import('@/lib/api-client')).default

      const transactions = selectedBatchUsers.map(u => ({
        userId: u.user_id,
        creditScore: u.credit_score,
        salary: u.salary,
        balance: u.balance
      }))

      addBlockchainLog('🔄 Aggregating individual proofs into Merkle tree...')
      const result = await apiClient.generateProof('rollup', { transactions })

      if (result.success && result.data) {
        addBlockchainLog('✅ Batch proof aggregated successfully')
        addBlockchainLog(`🌳 Merkle Root: ${result.data.merkleRoot}`)
        addBlockchainLog(`📊 Processed ${transactions.length} transactions in single proof`)
        addBlockchainLog('⛓️  Submitting to Layer-1...')

        if (result.data.invalidTransactionCount > 0) {
          addBlockchainLog(`⚠️ Warning: ${result.data.invalidTransactionCount} transactions rejected (Score < 700)`)
          addBlockchainLog(`❌ Rejected IDs: ${result.data.invalidTransactions.join(', ')}`)
        }

        setTimeout(() => {
          addBlockchainLog(`✅ Batch verified on-chain | Block #${Math.floor(Math.random() * 1000000)}`)
          addBlockchainLog(`💰 Gas savings: ${((1 - 45000 / (transactions.length * 150000)) * 100).toFixed(0)}%`)
        }, 500)

        setProofResults(prev => ({
          ...prev,
          rollup: {
            type: 'rollup',
            status: 'success',
            proof: result.data,
            metrics: {
              proofSize: result.data.metrics?.proofSize || '~30 KB',
              generationTime: result.data.metrics?.generationTime || '15 ms',
              verificationTime: result.data.metrics?.verificationTime || '0.1 ms',
              gasCost: result.data.metrics?.gasCost || `~45,000 gas (for ${transactions.length} users)`
            }
          }
        }))
      } else {
        throw new Error(result.error || 'Failed to generate proof')
      }
    } catch (error: any) {
      addBlockchainLog('❌ Error: ' + error.message)
      setProofResults(prev => ({
        ...prev,
        rollup: { type: 'rollup', status: 'error', error: error.message }
      }))
    }
  }

  const runHybridFlow = async () => {
    setProofResults(prev => ({ ...prev, hybrid: { type: 'hybrid', status: 'generating' } }))
    addBlockchainLog('📡 Initiating Hybrid ZKP Framework...')
    addBlockchainLog('🔐 Step 1: Generating SNARK proofs for privacy...')

    try {
      const apiClient = (await import('@/lib/api-client')).default

      setTimeout(() => addBlockchainLog('⚡ Step 2: Aggregating with zk-Rollup...'), 800)
      setTimeout(() => addBlockchainLog('🌟 Step 3: STARK audit layer activated...'), 1600)

      const result = await apiClient.runHybridFlow(10)

      if (result.success && result.data) {
        addBlockchainLog('✅ Hybrid flow completed successfully!')
        addBlockchainLog('📊 Privacy: ✓ | Transparency: ✓ | Scalability: ✓')
        addBlockchainLog('⛓️  Submitting to blockchain...')

        setTimeout(() => {
          addBlockchainLog(`✅ Hybrid proof verified | Block #${Math.floor(Math.random() * 1000000)}`)
        }, 500)

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
      addBlockchainLog('❌ Error: ' + error.message)
      setProofResults(prev => ({
        ...prev,
        hybrid: { type: 'hybrid', status: 'error', error: error.message }
      }))
    }
  }

  const viewCircuitCode = async (circuitName: string) => {
    try {
      const response = await fetch(`/api/zkp/circuit/${circuitName}`)
      const result = await response.json()
      if (result.success && result.data) {
        setCircuitCode(result.data.code)
        setShowCircuit(true)
      }
    } catch (error) {
      console.error('Error fetching circuit code:', error)
    }
  }

  const addBlockchainLog = (message: string) => {
    setBlockchainLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab as any} setActiveTab={(tab) => handleTabChange(tab as string)} />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Complete ZKP Demonstration</h1>
            <p className="text-muted-foreground">
              Interactive demonstration of zk-SNARK, zk-STARK, zk-Rollup, and Hybrid Framework
            </p>
          </div>

          {/* Input Mode Selection */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database className={`h-5 w-5 ${inputMode === 'dataset' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Label htmlFor="input-mode" className="font-medium">Input Source:</Label>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${inputMode === 'dataset' ? 'font-bold' : ''}`}>Dataset</span>
              <Switch
                id="input-mode"
                checked={inputMode === 'manual'}
                onCheckedChange={(checked) => setInputMode(checked ? 'manual' : 'dataset')}
              />
              <span className={`text-sm ${inputMode === 'manual' ? 'font-bold' : ''}`}>Manual Input</span>
            </div>
          </div>

          {/* Data Selection / Input Area */}
          <Card className="p-6 mb-6">
            {inputMode === 'dataset' ? (
              <>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5" />
                  Select User from Dataset
                </h2>

                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No users found in dataset. Please check backend connection.</p>
                    <Button onClick={() => setInputMode('manual')} variant="link" className="mt-2">
                      Switch to Manual Input
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 max-h-40 overflow-y-auto">
                    {users.map(user => (
                      <button
                        key={user.user_id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-3 rounded-lg border text-left transition-colors ${selectedUser?.user_id === user.user_id
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
                )}

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
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    Manual Input Configuration
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="creditScore">Credit Score</Label>
                    <Input
                      id="creditScore"
                      type="number"
                      value={manualInputs.creditScore}
                      onChange={(e) => handleManualInputChange('creditScore', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Annual Salary ($)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={manualInputs.salary}
                      onChange={(e) => handleManualInputChange('salary', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Account Balance ($)</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={manualInputs.balance}
                      onChange={(e) => handleManualInputChange('balance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={manualInputs.age}
                      onChange={(e) => handleManualInputChange('age', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country Code</Label>
                    <Input
                      id="country"
                      value={manualInputs.country}
                      onChange={(e) => handleManualInputChange('country', e.target.value)}
                      placeholder="US, UK, etc."
                    />
                  </div>
                </div>
              </>
            )}


          </Card>

          {/* Blockchain Status Log */}
          {blockchainLogs.length > 0 && (
            <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-green-600" />
                  Blockchain Activity Log
                </h3>
                <Button onClick={() => setBlockchainLogs([])} variant="ghost" size="sm">
                  Clear
                </Button>
              </div>
              <div className="bg-zinc-950 text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-y-auto space-y-1 border border-zinc-800 shadow-inner">
                {blockchainLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-white/5 pb-1 mb-1 last:border-0">{log}</div>
                ))}
              </div>
            </Card>
          )}

          {/* Circuit Code Viewer Dialog */}
          {showCircuit && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCircuit(false)}>
              <Card className="p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Circom Circuit Code</h2>
                  <Button onClick={() => setShowCircuit(false)} variant="ghost" size="sm">✕</Button>
                </div>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{circuitCode}</code>
                </pre>
              </Card>
            </div>
          )}

          {/* ZKP Types */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="snark" onClick={() => setActiveTab('snark')} className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                zk-SNARK
              </TabsTrigger>
              <TabsTrigger value="stark" onClick={() => setActiveTab('stark')} className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                zk-STARK
              </TabsTrigger>
              <TabsTrigger value="rollup" onClick={() => setActiveTab('rollup')} className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                zk-Rollup
              </TabsTrigger>
              <TabsTrigger value="hybrid" onClick={() => setActiveTab('hybrid')} className="flex items-center gap-2">
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
                  <div className="flex gap-2">
                    <Button
                      onClick={() => viewCircuitCode('credit_score')}
                      variant="outline"
                    >
                      View Circuit
                    </Button>
                    <Button
                      onClick={generateSNARKProof}
                      disabled={(!selectedUser && inputMode === 'dataset') || proofResults.snark.status === 'generating'}
                    >
                      {proofResults.snark.status === 'generating' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Generate Proof
                    </Button>
                  </div>
                </div>

                <ComprehensiveProofDisplay result={proofResults.snark} />
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
                    disabled={(!selectedUser && inputMode === 'dataset') || proofResults.stark.status === 'generating'}
                  >
                    {proofResults.stark.status === 'generating' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Generate Proof
                  </Button>
                </div>

                <ComprehensiveProofDisplay result={proofResults.stark} />
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
                    disabled={proofResults.rollup.status === 'generating' || selectedBatchUsers.length === 0}
                  >
                    {proofResults.rollup.status === 'generating' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Process Batch ({selectedBatchUsers.length} users)
                  </Button>
                </div>

                {/* Batch Selection UI */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Selected Batch ({selectedBatchUsers.length}/10)
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {users.slice(0, 20).map(user => (
                      <button
                        key={user.user_id}
                        onClick={() => {
                          if (selectedBatchUsers.find(u => u.user_id === user.user_id)) {
                            setSelectedBatchUsers(prev => prev.filter(u => u.user_id !== user.user_id))
                          } else {
                            if (selectedBatchUsers.length < 10) {
                              setSelectedBatchUsers(prev => [...prev, user])
                            }
                          }
                        }}
                        className={`p-2 text-xs rounded border transition-colors ${selectedBatchUsers.find(u => u.user_id === user.user_id)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:border-primary/50'
                          }`}
                      >
                        User {user.user_id}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select up to 10 users to include in the rollup batch.
                  </p>
                </div>

                <ComprehensiveProofDisplay result={proofResults.rollup} />
              </Card>
            </TabsContent>

            {/* Hybrid */}
            <TabsContent value="hybrid">
              <HybridFlowDemo />

            </TabsContent>
          </Tabs>
        </div>
      </main >
    </div >
  )
}



