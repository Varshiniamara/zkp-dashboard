"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import ProofTypeSelector from "@/components/proof-type-selector"
import HybridFlowDemo from "@/components/hybrid-flow-demo"
import ProofGenerator from "@/components/proof-generator"
import DatasetViewer from "@/components/dataset-viewer"
import type { DashboardTab } from "@/types/tabs"

function HomeContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<DashboardTab>("home")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["home", "dataset", "snark", "stark", "rollup", "hybrid", "demo"].includes(tab)) {
      setActiveTab(tab as DashboardTab)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-16">
        {activeTab === "home" && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <ProofTypeSelector
              setSelectedProofType={(type: any) => setActiveTab(type)}
              setActiveTab={setActiveTab}
            />
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <a href="/demo" className="inline-block">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg">
                    🚀 Launch Complete ZKP Demo
                  </button>
                </a>
                <p className="text-muted-foreground mt-2">Interactive demonstration of all ZKP types</p>
              </div>

              {/* About Section */}
              <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-card border rounded-lg p-8">
                  <h2 className="text-3xl font-bold mb-4">About This Project</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    A comprehensive Zero-Knowledge Proof (ZKP) demonstration platform showcasing cutting-edge privacy-preserving cryptography for financial applications.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">🔐 zk-SNARK</h3>
                      <p className="text-sm text-muted-foreground">Privacy-preserving proofs for sensitive data like credit scores and financial information</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">🌟 zk-STARK</h3>
                      <p className="text-sm text-muted-foreground">Transparent verification without trusted setup for public eligibility checks</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">⚡ zk-Rollup</h3>
                      <p className="text-sm text-muted-foreground">Scalable batch processing reducing gas costs by up to 95%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-4">Hybrid Architecture</h2>
                  <p className="text-muted-foreground mb-4">
                    Our innovative hybrid framework combines the strengths of all three ZKP technologies:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Privacy:</strong> zk-SNARK protects sensitive user data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Transparency:</strong> zk-STARK enables public audits without revealing data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Scalability:</strong> zk-Rollup batches proofs for massive cost savings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "demo" && (
          <div className="container mx-auto px-4 py-4">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">Complete ZKP Demonstration</h1>
              <p className="text-muted-foreground mb-8">Redirecting to demo page...</p>
              <a href="/demo" className="text-primary hover:underline">
                Click here if not redirected
              </a>
            </div>
          </div>
        )}
        {activeTab === "dataset" && <DatasetViewer />}
        {activeTab === "snark" && <ProofGenerator proofType="snark" />}
        {activeTab === "stark" && <ProofGenerator proofType="stark" />}
        {activeTab === "rollup" && (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4">zk-Rollup</h1>
            <p className="text-muted-foreground mb-8">Batch multiple transactions into a single proof for scalability.</p>
            <ProofGenerator proofType="snark" />
          </div>
        )}
        {activeTab === "hybrid" && <HybridFlowDemo />}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
