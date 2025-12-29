"use client"

import { useState, useEffect, Suspense } from "react"
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

function DemoContent() {
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


  export default function ZKPDemoPage() {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <DemoContent />
      </Suspense>
    )
  }



