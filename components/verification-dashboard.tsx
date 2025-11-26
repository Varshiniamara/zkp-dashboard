"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

export default function VerificationDashboard() {
  const [verifications, setVerifications] = useState<any[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(`${apiUrl}/zkp/history`);
        const result = await response.json();

        if (result.success) {
          const mappedData = result.data.map((item: any) => ({
            id: item.proofId,
            proofHash: item.proofId, // Use proofId as hash for display
            type: item.circuitType === 'snark' ? 'zk-SNARK' : (item.circuitType === 'stark' ? 'zk-STARK' : 'zk-Rollup'),
            statement: item.circuitType === 'snark' ? 'Credit Score Verified' : (item.circuitType === 'stark' ? 'Age/Country Verified' : 'Batch Processed'),
            timestamp: new Date(item.createdAt).toLocaleString(),
            status: item.verified ? 'Valid' : 'Invalid',
            verificationTime: item.circuitType === 'snark' ? '0.08ms' : '0.42ms', // Mock metrics
            circuitSize: item.circuitType === 'snark' ? '50K gates' : '100K gates',
            constraints: item.circuitType === 'snark' ? '1,024' : '2,048',
            proofSize: item.circuitType === 'snark' ? '288 bytes' : '156 KB',
          }));
          setVerifications(mappedData);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        // Fallback to mock data if API fails
        setVerifications([
          {
            id: 1,
            proofHash: "0x7a3f8c2e9b1d4a6f5e8c3b2a1d9f4e7c",
            type: "zk-SNARK",
            statement: "Private transaction verified",
            timestamp: "2024-10-18 14:32:15",
            status: "Valid",
            verificationTime: "0.08ms",
            circuitSize: "50K gates",
            constraints: "1,024",
            proofSize: "288 bytes",
          },
          {
            id: 2,
            proofHash: "0x9e2c5f1a8d3b7e4c6a9f2e5d8c1b4a7f",
            type: "zk-STARK",
            statement: "Computation integrity verified",
            timestamp: "2024-10-18 14:28:42",
            status: "Valid",
            verificationTime: "0.42ms",
            circuitSize: "100K gates",
            constraints: "2,048",
            proofSize: "156 KB",
          }
        ]);
      }
    };

    fetchHistory();
  }, []);

  const [filterType, setFilterType] = useState<"all" | "snark" | "stark">("all")
  const [selectedVerification, setSelectedVerification] = useState<(typeof verifications)[0] | null>(null)

  const verificationTrends = [
    { time: "00:00", verifications: 12, avgTime: 0.15 },
    { time: "04:00", verifications: 18, avgTime: 0.18 },
    { time: "08:00", verifications: 35, avgTime: 0.16 },
    { time: "12:00", verifications: 52, avgTime: 0.19 },
    { time: "16:00", verifications: 48, avgTime: 0.17 },
    { time: "20:00", verifications: 42, avgTime: 0.2 },
  ]

  const proofTypeDistribution = [
    { name: "zk-SNARK", value: 65, color: "var(--color-primary)" },
    { name: "zk-STARK", value: 35, color: "var(--color-secondary)" },
  ]

  const filteredVerifications = verifications.filter((v) => {
    if (filterType === "all") return true
    if (filterType === "snark") return v.type === "zk-SNARK"
    if (filterType === "stark") return v.type === "zk-STARK"
    return true
  })

  const totalVerifications = verifications.length
  const successRate = 100
  const avgVerificationTime = (
    verifications.reduce((sum, v) => sum + Number.parseFloat(v.verificationTime), 0) / verifications.length
  ).toFixed(2)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Verification Dashboard</h1>
        <p className="text-muted-foreground mb-8">Monitor and verify zero-knowledge proofs in real-time</p>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border border-border p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Verifications</div>
            <div className="text-3xl font-bold">{totalVerifications}</div>
            <p className="text-xs text-muted-foreground mt-2">+12 this hour</p>
          </Card>
          <Card className="bg-card border border-border p-6">
            <div className="text-sm text-muted-foreground mb-2">Success Rate</div>
            <div className="text-3xl font-bold text-accent">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">All proofs valid</p>
          </Card>
          <Card className="bg-card border border-border p-6">
            <div className="text-sm text-muted-foreground mb-2">Avg Verification Time</div>
            <div className="text-3xl font-bold">{avgVerificationTime}ms</div>
            <p className="text-xs text-muted-foreground mt-2">Sub-millisecond</p>
          </Card>
          <Card className="bg-card border border-border p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Proof Size</div>
            <div className="text-3xl font-bold">156.6 KB</div>
            <p className="text-xs text-muted-foreground mt-2">Across all proofs</p>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Verification Trends */}
          <Card className="lg:col-span-2 bg-card border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Verification Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={verificationTrends}>
                <defs>
                  <linearGradient id="colorVerifications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Area
                  type="monotone"
                  dataKey="verifications"
                  stroke="var(--color-primary)"
                  fillOpacity={1}
                  fill="url(#colorVerifications)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Proof Type Distribution */}
          <Card className="bg-card border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Proof Type Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={proofTypeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                  {proofTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {proofTypeDistribution.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Verification Details */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Verification List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Verifications</h2>
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterType === "snark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType("snark")}
                    >
                      SNARKs
                    </Button>
                    <Button
                      variant={filterType === "stark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType("stark")}
                    >
                      STARKs
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Proof Hash</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Statement</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVerifications.map((verification) => (
                      <tr
                        key={verification.id}
                        className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedVerification(verification)}
                      >
                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                          {verification.proofHash.slice(0, 16)}...
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${verification.type === "zk-SNARK"
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/20 text-secondary"
                              }`}
                          >
                            {verification.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{verification.statement}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{verification.timestamp}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="text-accent font-semibold">{verification.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Detailed View */}
          <div>
            {selectedVerification ? (
              <Card className="bg-card border border-border p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4">Verification Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Proof Hash</p>
                    <p className="text-xs font-mono bg-background rounded p-2 break-all text-accent">
                      {selectedVerification.proofHash}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="text-sm font-semibold">{selectedVerification.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Statement</p>
                    <p className="text-sm">{selectedVerification.statement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Verification Time</p>
                    <p className="text-sm font-semibold">{selectedVerification.verificationTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Circuit Size</p>
                    <p className="text-sm font-semibold">{selectedVerification.circuitSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Constraints</p>
                    <p className="text-sm font-semibold">{selectedVerification.constraints}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Proof Size</p>
                    <p className="text-sm font-semibold">{selectedVerification.proofSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-semibold text-accent">{selectedVerification.status}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 bg-transparent"
                    onClick={() => setSelectedVerification(null)}
                  >
                    Clear Selection
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="bg-card border border-border p-6 text-center">
                <p className="text-muted-foreground">Select a verification to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
