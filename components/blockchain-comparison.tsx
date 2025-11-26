"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function BlockchainComparison() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const platforms = [
    {
      id: "zcash",
      name: "Zcash",
      proofType: "zk-SNARK",
      useCase: "Private Transactions",
      description: "Uses zk-SNARKs to enable shielded transactions where transaction details remain private.",
      features: ["Private addresses", "Shielded pools", "Selective disclosure"],
      throughput: "~7 TPS",
      privacyLevel: "Very High",
      launchYear: 2016,
      tvl: "$500M+",
      ecosystem: "Mature",
      advantages: [
        "Proven privacy implementation",
        "Established ecosystem",
        "Strong community",
        "Multiple wallet support",
      ],
      disadvantages: ["Limited throughput", "Trusted setup required", "Smaller ecosystem than Ethereum"],
      technicalDetails: {
        proofSize: "288 bytes",
        verificationTime: "0.08ms",
        setupComplexity: "High",
        quantumResistant: false,
      },
    },
    {
      id: "ethereum-zk",
      name: "Ethereum (zk-rollups)",
      proofType: "zk-SNARK/STARK",
      useCase: "Layer 2 Scaling",
      description: "zk-rollups batch transactions and use zero-knowledge proofs to verify them on-chain.",
      features: ["High throughput", "Low fees", "Ethereum security"],
      throughput: "~2000-4000 TPS",
      privacyLevel: "Medium",
      launchYear: 2021,
      tvl: "$5B+",
      ecosystem: "Rapidly Growing",
      advantages: ["Ethereum security", "High throughput", "Low transaction fees", "Growing ecosystem"],
      disadvantages: ["Proof verification costs", "Complexity", "Emerging technology"],
      technicalDetails: {
        proofSize: "Variable",
        verificationTime: "Fast",
        setupComplexity: "Medium",
        quantumResistant: false,
      },
    },
    {
      id: "starknet",
      name: "StarkNet",
      proofType: "zk-STARK",
      useCase: "Scalable Smart Contracts",
      description: "Uses zk-STARKs for transparent, scalable computation without trusted setup.",
      features: ["No trusted setup", "Post-quantum secure", "Cairo language"],
      throughput: "~1000+ TPS",
      privacyLevel: "Medium",
      launchYear: 2021,
      tvl: "$200M+",
      ecosystem: "Growing",
      advantages: ["No trusted setup", "Post-quantum secure", "Transparent", "Scalable computation"],
      disadvantages: ["Newer technology", "Smaller ecosystem", "Larger proof sizes"],
      technicalDetails: {
        proofSize: "100-200 KB",
        verificationTime: "0.42ms",
        setupComplexity: "Low",
        quantumResistant: true,
      },
    },
    {
      id: "polygon-zkevm",
      name: "Polygon zkEVM",
      proofType: "zk-SNARK",
      useCase: "EVM-Compatible Scaling",
      description: "Provides Ethereum-compatible environment with zk-SNARK proofs for scalability.",
      features: ["EVM compatible", "Ethereum security", "Low latency"],
      throughput: "~1000+ TPS",
      privacyLevel: "Medium",
      launchYear: 2023,
      tvl: "$1B+",
      ecosystem: "Emerging",
      advantages: ["EVM compatibility", "Ethereum security", "Developer friendly", "Fast finality"],
      disadvantages: ["Trusted setup", "Newer platform", "Limited history"],
      technicalDetails: {
        proofSize: "288 bytes",
        verificationTime: "Very Fast",
        setupComplexity: "High",
        quantumResistant: false,
      },
    },
    {
      id: "immutable-x",
      name: "Immutable X",
      proofType: "zk-STARK",
      useCase: "NFT Scaling",
      description: "Layer 2 solution for NFTs using zk-STARKs for scalable, gas-free minting.",
      features: ["Gas-free minting", "Instant trades", "Carbon neutral"],
      throughput: "~9000 TPS",
      privacyLevel: "Low",
      launchYear: 2021,
      tvl: "$500M+",
      ecosystem: "Specialized",
      advantages: ["Gas-free transactions", "High throughput", "NFT optimized", "Carbon neutral"],
      disadvantages: ["NFT focused", "Limited general use", "Smaller ecosystem"],
      technicalDetails: {
        proofSize: "100-200 KB",
        verificationTime: "Moderate",
        setupComplexity: "Low",
        quantumResistant: true,
      },
    },
  ]

  const comparisonData = [
    { metric: "Throughput (TPS)", zcash: 7, ethereum: 3000, starknet: 1000, polygon: 1000, immutable: 9000 },
    { metric: "Proof Size (bytes)", zcash: 288, ethereum: 500, starknet: 150000, polygon: 288, immutable: 150000 },
    { metric: "Verification Speed", zcash: 95, ethereum: 80, starknet: 60, polygon: 95, immutable: 60 },
    { metric: "Ecosystem Maturity", zcash: 95, ethereum: 90, starknet: 50, polygon: 60, immutable: 40 },
  ]

  const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Blockchain Platform Comparison</h1>
        <p className="text-muted-foreground mb-8">How different platforms implement zero-knowledge proofs</p>

        {/* Platform Cards */}
        <div className="space-y-6 mb-8">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className={`bg-card border transition-all cursor-pointer ${
                selectedPlatform === platform.id ? "border-primary" : "border-border"
              } p-8`}
              onClick={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{platform.name}</h2>
                  <p className="text-muted-foreground">{platform.description}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${
                    platform.proofType.includes("SNARK") && !platform.proofType.includes("STARK")
                      ? "bg-primary/20 text-primary"
                      : platform.proofType.includes("STARK")
                        ? "bg-secondary/20 text-secondary"
                        : "bg-accent/20 text-accent"
                  }`}
                >
                  {platform.proofType}
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Use Case</div>
                  <div className="font-semibold text-sm">{platform.useCase}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Throughput</div>
                  <div className="font-semibold text-sm">{platform.throughput}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Privacy Level</div>
                  <div className="font-semibold text-sm">{platform.privacyLevel}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">TVL</div>
                  <div className="font-semibold text-sm">{platform.tvl}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Ecosystem</div>
                  <div className="font-semibold text-sm">{platform.ecosystem}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-3">Key Features</div>
                <div className="flex flex-wrap gap-2">
                  {platform.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1 bg-muted/50 border border-border rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedPlatform === platform.id && (
                <div className="mt-6 pt-6 border-t border-border space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-sm mb-3 text-accent">Advantages</h3>
                      <ul className="space-y-2">
                        {platform.advantages.map((adv, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-accent">✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-3 text-destructive">Disadvantages</h3>
                      <ul className="space-y-2">
                        {platform.disadvantages.map((dis, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <span className="text-destructive">✗</span>
                            <span>{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-background rounded p-4 border border-border">
                    <h3 className="font-bold text-sm mb-3">Technical Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Proof Size:</span>
                        <span className="ml-2 font-semibold">{platform.technicalDetails.proofSize}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Verification Time:</span>
                        <span className="ml-2 font-semibold">{platform.technicalDetails.verificationTime}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Setup Complexity:</span>
                        <span className="ml-2 font-semibold">{platform.technicalDetails.setupComplexity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantum Resistant:</span>
                        <span className="ml-2 font-semibold">
                          {platform.technicalDetails.quantumResistant ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Comparison Chart */}
        <Card className="bg-card border border-border p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Performance Comparison</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="metric" stroke="var(--color-muted-foreground)" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend />
              <Bar dataKey="zcash" fill="var(--color-primary)" name="Zcash" />
              <Bar dataKey="ethereum" fill="var(--color-secondary)" name="Ethereum" />
              <Bar dataKey="starknet" fill="var(--color-accent)" name="StarkNet" />
              <Bar dataKey="polygon" fill="var(--color-chart-4)" name="Polygon" />
              <Bar dataKey="immutable" fill="var(--color-chart-5)" name="Immutable X" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Comparison Matrix */}
        <Card className="bg-card border border-border p-8">
          <h2 className="text-2xl font-bold mb-6">Detailed Comparison Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold">Platform</th>
                  <th className="px-4 py-3 text-left font-semibold">Proof Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Trusted Setup</th>
                  <th className="px-4 py-3 text-left font-semibold">Proof Size</th>
                  <th className="px-4 py-3 text-left font-semibold">Throughput</th>
                  <th className="px-4 py-3 text-left font-semibold">Quantum Safe</th>
                  <th className="px-4 py-3 text-left font-semibold">Launch Year</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((platform) => (
                  <tr key={platform.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-semibold">{platform.name}</td>
                    <td className="px-4 py-3">{platform.proofType}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          platform.technicalDetails.setupComplexity === "Low" ? "text-secondary" : "text-accent"
                        }
                      >
                        {platform.technicalDetails.setupComplexity === "Low" ? "No" : "Yes"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{platform.technicalDetails.proofSize}</td>
                    <td className="px-4 py-3">{platform.throughput}</td>
                    <td className="px-4 py-3">
                      <span className={platform.technicalDetails.quantumResistant ? "text-secondary" : "text-accent"}>
                        {platform.technicalDetails.quantumResistant ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{platform.launchYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
