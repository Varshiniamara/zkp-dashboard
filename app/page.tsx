"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import ProofTypeSelector from "@/components/proof-type-selector"
import SNARKDetails from "@/components/snark-details"
import STARKDetails from "@/components/stark-details"
import HybridFlowDemo from "@/components/hybrid-flow-demo"
import ProofGenerator from "@/components/proof-generator"
import DatasetViewer from "@/components/dataset-viewer"
import type { DashboardTab } from "@/types/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("home")

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-16">
        {activeTab === "home" && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <ProofTypeSelector
              setSelectedProofType={(type) => setActiveTab(type)}
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
