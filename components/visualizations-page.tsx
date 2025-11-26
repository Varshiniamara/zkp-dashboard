"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"

export default function VisualizationsPage() {
  // Data for various visualizations
  const proofSystemComparison = [
    {
      metric: "Proof Size",
      snark: 288,
      stark: 156000,
      bulletproof: 672,
    },
    {
      metric: "Verification Speed",
      snark: 95,
      stark: 70,
      bulletproof: 60,
    },
    {
      metric: "Setup Complexity",
      snark: 80,
      stark: 20,
      bulletproof: 30,
    },
    {
      metric: "Quantum Resistance",
      snark: 10,
      stark: 95,
      bulletproof: 90,
    },
    {
      metric: "Scalability",
      snark: 60,
      stark: 95,
      bulletproof: 70,
    },
  ]

  const computationComplexity = [
    { gates: "1K", snarkTime: 1.2, starkTime: 1.5, proofSize: 0.288 },
    { gates: "10K", snarkTime: 12, starkTime: 4.5, proofSize: 0.288 },
    { gates: "100K", snarkTime: 120, starkTime: 15, proofSize: 0.288 },
    { gates: "1M", snarkTime: 1200, starkTime: 50, proofSize: 0.288 },
    { gates: "10M", snarkTime: 12000, starkTime: 150, proofSize: 0.288 },
  ]

  const verificationMetrics = [
    { system: "zk-SNARK", avgTime: 0.08, maxTime: 0.15, minTime: 0.05 },
    { system: "zk-STARK", avgTime: 0.42, maxTime: 0.8, minTime: 0.2 },
    { system: "Bulletproof", avgTime: 0.25, maxTime: 0.5, minTime: 0.1 },
  ]

  const radarData = [
    { category: "Proof Size", snark: 95, stark: 40, bulletproof: 85 },
    { category: "Speed", snark: 95, stark: 70, bulletproof: 75 },
    { category: "Quantum Safe", snark: 10, stark: 95, bulletproof: 90 },
    { category: "Scalability", snark: 60, stark: 95, bulletproof: 70 },
    { category: "Maturity", snark: 95, stark: 70, bulletproof: 60 },
    { category: "Simplicity", snark: 40, stark: 50, bulletproof: 70 },
  ]

  const proofGenerationFlow = [
    { step: "Input", time: 0, cumulative: 0 },
    { step: "Compilation", time: 5, cumulative: 5 },
    { step: "Setup", time: 120, cumulative: 125 },
    { step: "Witness Gen", time: 50, cumulative: 175 },
    { step: "Proof Gen", time: 2.5, cumulative: 177.5 },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Proof System Visualizations</h1>
        <p className="text-muted-foreground mb-8">
          Comprehensive visual analysis of zero-knowledge proof systems and their characteristics
        </p>

        {/* Proof System Comparison Radar */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border border-border p-6">
            <h2 className="text-xl font-bold mb-4">System Characteristics Radar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="category" stroke="var(--color-muted-foreground)" />
                <PolarRadiusAxis stroke="var(--color-muted-foreground)" />
                <Radar
                  name="zk-SNARK"
                  dataKey="snark"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.25}
                />
                <Radar
                  name="zk-STARK"
                  dataKey="stark"
                  stroke="var(--color-secondary)"
                  fill="var(--color-secondary)"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Bulletproof"
                  dataKey="bulletproof"
                  stroke="var(--color-accent)"
                  fill="var(--color-accent)"
                  fillOpacity={0.25}
                />
                <Legend />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-card border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Proof System Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={proofSystemComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="metric"
                  stroke="var(--color-muted-foreground)"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Bar dataKey="snark" fill="var(--color-primary)" />
                <Bar dataKey="stark" fill="var(--color-secondary)" />
                <Bar dataKey="bulletproof" fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Computation Complexity */}
        <Card className="bg-card border border-border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Computation Complexity Analysis</h2>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={computationComplexity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="gates" stroke="var(--color-muted-foreground)" />
              <YAxis
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--color-muted-foreground)"
                label={{ value: "Proof Size (KB)", angle: 90, position: "insideRight" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="snarkTime"
                stroke="var(--color-primary)"
                strokeWidth={2}
                name="SNARK Time (ms)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="starkTime"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                name="STARK Time (ms)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Verification Metrics */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Verification Time Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={verificationMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="system" stroke="var(--color-muted-foreground)" />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Bar dataKey="minTime" fill="var(--color-accent)" name="Min Time" />
                <Bar dataKey="avgTime" fill="var(--color-primary)" name="Avg Time" />
                <Bar dataKey="maxTime" fill="var(--color-destructive)" name="Max Time" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-card border border-border p-6">
            <h2 className="text-xl font-bold mb-4">Proof Generation Pipeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={proofGenerationFlow} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" />
                <YAxis dataKey="step" type="category" stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Bar dataKey="time" fill="var(--color-primary)" name="Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Key Insights */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card border border-border p-6">
            <h3 className="text-lg font-bold mb-3 text-primary">zk-SNARK Strengths</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Extremely compact proofs (288 bytes)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Fast verification (0.08ms average)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Proven in production systems</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Efficient for simple statements</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-card border border-border p-6">
            <h3 className="text-lg font-bold mb-3 text-secondary">zk-STARK Strengths</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
                <span>Scales well with computation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>Transparent and verifiable</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-card border border-border p-6">
            <h3 className="text-lg font-bold mb-3 text-accent">Bulletproof Strengths</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>No trusted setup</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>Logarithmic proof size</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>Range proofs optimized</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span>
                <span>Privacy-focused design</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
