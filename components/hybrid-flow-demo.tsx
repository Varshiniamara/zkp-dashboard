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
    const [isRunning, setIsRunning] = useState(false)
    const [logs, setLogs] = useState<string[]>([])
    const [result, setResult] = useState<any>(null)

    const addLog = (message: string) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
    }

    const runFlow = async () => {
        setIsRunning(true)
        setLogs([])
        setResult(null)
        addLog("🚀 Starting Hybrid ZKP Flow...")

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

            addLog("Phase 1: Generating 10 SNARK Proofs (Privacy Layer)...")
            // Simulate delay for visual effect
            await new Promise(r => setTimeout(r, 1000))

            const response = await fetch(`${apiUrl}/zkp/hybrid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userCount: 10 })
            });

            const data = await response.json();

            if (data.success) {
                const flow = data.data;
                addLog(`✅ SNARK Phase Complete: Generated ${flow.steps.snark.count} proofs in ${flow.steps.snark.totalTime}ms`)

                addLog("Phase 2: Batching into zk-Rollup (Scalability Layer)...")
                await new Promise(r => setTimeout(r, 800))
                addLog(`✅ Rollup Phase Complete: Batch ID ${flow.steps.rollup.batchId.slice(0, 8)}...`)
                addLog(`📊 Compression Ratio: ${flow.steps.rollup.compressionRatio}`)

                addLog("Phase 3: System Audit via zk-STARK (Transparency Layer)...")
                await new Promise(r => setTimeout(r, 800))
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
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/20 rounded-lg border border-border">
                                <h3 className="font-semibold mb-2">Flow Configuration</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>User Count: 10 (Simulated Batch)</li>
                                    <li>Privacy: Groth16 SNARKs</li>
                                    <li>Scalability: Merkle Batch Rollup</li>
                                    <li>Audit: STARK Verification</li>
                                </ul>
                            </div>

                            <Button
                                onClick={runFlow}
                                disabled={isRunning}
                                className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                            >
                                {isRunning ? "Running Flow..." : "Start Hybrid Flow"}
                            </Button>

                            <div className="h-64 bg-black/90 rounded-lg p-4 font-mono text-xs overflow-y-auto border border-border">
                                {logs.length === 0 && <span className="text-gray-500">Ready to start...</span>}
                                {logs.map((log, i) => (
                                    <div key={i} className="text-green-400 mb-1">{log}</div>
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
                                        <div className="text-xl font-bold text-accent">~90%</div>
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
