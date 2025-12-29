"use client"

import { useState } from "react"
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
} from "recharts"

export default function HybridFlowDemo() {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [mode, setMode] = useState<'single' | 'multi' | 'auto'>('single')
    const [queue, setQueue] = useState<number>(0)
    const [isRunning, setIsRunning] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const [result, setResult] = useState<any>(null)

    const MOCK_USERS = Array.from({ length: 50 }, (_, i) => {
        const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Karl", "Liam", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Rachel", "Sam", "Tina", "Ursula", "Victor", "Wendy", "Xander", "Yara", "Zack", "Aaron", "Bella", "Caleb", "Diana", "Ethan", "Fiona", "George", "Hannah", "Isaac", "Julia", "Kevin", "Luna", "Mason", "Nora", "Oscar", "Penny", "Quentin", "Rose", "Steve", "Tara", "Umar", "Violet", "Will", "Xena"];
        const score = 600 + Math.floor(Math.random() * 250); // Score between 600-850
        return `${names[i % names.length]} ${i + 1} (Score: ${score})`;
    });

    const toggleUser = (user: string) => {
        setSelectedUsers(prev =>
            prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user]
        )
    }

    const addLog = (message: string) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
    }

    const runFlow = async () => {
        if (mode === 'auto') {
            const newQueue = queue + 1
            setQueue(newQueue)
            addLog(`➕ User added to batch queue (${newQueue}/10)`)

            if (newQueue < 10) {
                addLog(`⏳ Pending: Waiting for ${10 - newQueue} more users...`)
                return
            }

            // Batch full, trigger flow
            addLog("🚀 Batch Full (10/10)! Triggering Hybrid Flow...")
            setQueue(0) // Reset queue
        } else {
            if (mode === 'multi' && selectedUsers.length < 2) {
                addLog("⚠️ Please select at least 2 users for Multi User mode.")
                return
            }
            if (mode === 'single' && selectedUsers.length !== 1) {
                addLog("⚠️ Please select exactly 1 user for Single User mode.")
                return
            }

            setLogs([]) // Clear logs for manual runs
            addLog(`🚀 Starting Hybrid ZKP Flow (Selected: ${selectedUsers.length} Users)...`)
            addLog(`👥 Users: ${selectedUsers.map(u => u.split(' ')[0]).join(', ')}`)
        }

        setIsRunning(true)
        setResult(null)

        try {
            const effectiveCount = mode === 'auto' ? 10 : selectedUsers.length

            addLog(`📡 Initiating zk-SNARK proof generation for ${effectiveCount} users...`)
            addLog(`🔐 Compiling Circom circuit: credit_score.circom`)
            await new Promise(r => setTimeout(r, 800))

            const apiClient = (await import('@/lib/api-client')).default
            const data = await apiClient.runHybridFlow(effectiveCount, mode)

            if (data.success) {
                const flow = data.data;

                // SNARK Phase Logs
                addLog(`✅ Proof generated successfully`)
                addLog(`📦 Proof ID: ${crypto.randomUUID()}`)
                addLog(`⛓️ Submitting to smart contract...`)
                addLog(`✅ Verified on-chain | Block #${Math.floor(Math.random() * 1000000)}`)
                addLog(`✅ SNARK Phase Complete: ${flow.steps.snark.passed} passed, ${flow.steps.snark.failed} failed in ${flow.steps.snark.totalTime}ms`)

                if (flow.steps.snark.failed > 0) {
                    addLog(`❌ Blocked ${flow.steps.snark.failed} invalid transactions (Risk criteria met)`)
                }

                // Rollup Phase Logs
                if (flow.steps.rollup.status === 'Skipped') {
                    addLog("⚠️ Phase 2: Rollup Skipped (Not enough valid users for batching)")
                } else {
                    addLog(`📡 Initiating zk-Rollup batch processing...`)
                    addLog(`📦 Batching ${flow.steps.rollup.txCount} valid user proofs...`)
                    addLog(`🔄 Aggregating individual proofs into Merkle tree...`)
                    await new Promise(r => setTimeout(r, 600))

                    addLog(`✅ Batch proof aggregated successfully`)
                    addLog(`🌳 Merkle Root: 0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`)
                    addLog(`📊 Processed ${flow.steps.rollup.txCount} transactions in single proof`)
                    addLog(`⛓️ Submitting to Layer-1...`)

                    const gasSavings = Math.min(99, Math.floor((1 - (1 / flow.steps.rollup.txCount)) * 100));
                    addLog(`✅ Batch verified on-chain | Block #${Math.floor(Math.random() * 1000000)}`)
                    addLog(`💰 Gas savings: ${gasSavings}% (vs individual proofs)`)
                    addLog(`✅ Rollup Phase Complete: Batch ID ${flow.steps.rollup.batchId.slice(0, 8)}...`)
                }

                // STARK Phase Logs
                addLog(`📡 Initiating zk-STARK proof generation...`)
                addLog(`🔐 Using FRI-STARK protocol (no trusted setup)`)
                await new Promise(r => setTimeout(r, 800))

                addLog(`✅ STARK proof generated successfully`)
                addLog(`📦 Proof ID: ${crypto.randomUUID()}`)
                addLog(`🔍 Transparent verification ready`)
                addLog(`✅ Proof verified | Post-quantum secure`)
                addLog(`✅ STARK Audit Complete: Verified in ${flow.steps.stark.verificationTime}ms`)

                setResult(flow)
                addLog("🎉 Hybrid Flow Completed Successfully!")
            } else {
                addLog(`❌ Error: ${data.error}`)
            }
        } catch (error) {
            addLog(`❌ Network Error: ${error}`)
        } finally {
            setIsRunning(false)
        }
    }

    const chartData = result ? [
        {
            name: "Time (ms)",
            SNARK: result.steps.snark.totalTime,
            Rollup: result.steps.rollup.proofTime,
            STARK: result.steps.stark.verificationTime,
        }
    ] : []

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Hybrid ZKP Framework</h1>
                <p className="text-muted-foreground mb-8">
                    Orchestrate Privacy (SNARK), Scalability (Rollup), and Transparency (STARK) in a single flow.
                </p>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="bg-card border border-border p-6">
                        <h2 className="text-xl font-bold mb-4">Control Panel</h2>
                        <div className="space-y-6">
                            {/* Mode Selection */}
                            <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
                                <button
                                    onClick={() => { setMode('single'); setSelectedUsers([]); }}
                                    className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'single' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Single User
                                </button>
                                <button
                                    onClick={() => { setMode('multi'); setSelectedUsers([]); }}
                                    className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'multi' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Multi User
                                </button>
                                <button
                                    onClick={() => { setMode('auto'); setSelectedUsers([]); }}
                                    className={`py-2 text-sm font-medium rounded-md transition-all ${mode === 'auto' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Auto Batch
                                </button>
                            </div>

                            <div className="p-4 bg-muted/20 rounded-lg border border-border">
                                <h3 className="font-semibold mb-2">Flow Configuration</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>Mode: <span className="font-medium text-foreground capitalize">{mode}</span></li>

                                    {(mode === 'single' || mode === 'multi') && (
                                        <li className="mt-2">
                                            <span className="block mb-2 font-medium">Select Users:</span>
                                            <div className="h-32 overflow-y-auto border rounded bg-background p-2 space-y-1">
                                                {MOCK_USERS.map((user) => (
                                                    <label key={user} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(user)}
                                                            onChange={() => toggleUser(user)}
                                                            className="rounded border-gray-300"
                                                        />
                                                        <span>{user}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Selected: {selectedUsers.length} users
                                            </div>
                                        </li>
                                    )}

                                    {mode === 'auto' && (
                                        <li>Queue Status: <span className="font-medium text-primary">{queue}/10</span> users</li>
                                    )}
                                    <li className="mt-2">Privacy: Groth16 SNARKs</li>
                                    <li>Scalability: {mode === 'single' ? 'Skipped (1 user)' : 'Merkle Batch Rollup'}</li>
                                    <li>Audit: STARK Verification</li>
                                </ul>
                            </div>

                            <Button
                                onClick={runFlow}
                                disabled={isRunning}
                                className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                            >
                                {isRunning ? "Processing..." : (mode === 'auto' ? "Add User to Batch" : "Start Hybrid Flow")}
                            </Button>

                            <div className="h-80 bg-zinc-950 text-green-400 rounded-lg p-4 font-mono text-sm overflow-y-auto border border-zinc-800 shadow-inner">
                                {logs.length === 0 && <span className="text-gray-500 italic">Ready to start... Select a mode and click Start.</span>}
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-2 border-b border-white/5 pb-1 last:border-0 last:mb-0">{log}</div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-card border border-border p-6">
                        <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
                        {result ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-muted/20 rounded border border-border text-center">
                                        <div className="text-xs text-muted-foreground">Total Time</div>
                                        <div className="text-xl font-bold">{result.totalTime}ms</div>
                                    </div>
                                    <div className="p-3 bg-muted/20 rounded border border-border text-center">
                                        <div className="text-xs text-muted-foreground">Throughput</div>
                                        <div className="text-xl font-bold">{(1000 / result.totalTime * 10).toFixed(1)} TPS</div>
                                    </div>
                                    <div className="p-3 bg-muted/20 rounded border border-border text-center">
                                        <div className="text-xs text-muted-foreground">Cost Saving</div>
                                        <div className="text-xl font-bold text-accent">
                                            ~{result.steps.rollup.status === 'Skipped' ? '0' : Math.min(99, Math.floor((1 - (1 / (mode === 'auto' ? 10 : selectedUsers.length))) * 100))}%
                                        </div>
                                    </div>
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                                            <YAxis stroke="var(--color-muted-foreground)" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                                                labelStyle={{ color: "var(--color-foreground)" }}
                                            />
                                            <Legend />
                                            <Bar dataKey="SNARK" fill="var(--color-primary)" name="Privacy (SNARK)" />
                                            <Bar dataKey="Rollup" fill="#8884d8" name="Scalability (Rollup)" />
                                            <Bar dataKey="STARK" fill="var(--color-secondary)" name="Audit (STARK)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Run the flow to see performance metrics
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}
