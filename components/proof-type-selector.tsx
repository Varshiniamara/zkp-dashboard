"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction } from "react"
import type { DashboardTab } from "@/types/tabs"

interface ProofTypeSelectorProps {
  setSelectedProofType: (type: "snark" | "stark") => void
  setActiveTab: Dispatch<SetStateAction<DashboardTab>>
}

export default function ProofTypeSelector({ setSelectedProofType, setActiveTab }: ProofTypeSelectorProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-12 text-center">Understanding Zero-Knowledge Proofs</h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card
          className="bg-card border border-border p-8 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => {
            setSelectedProofType("snark")
            setActiveTab("snark")
          }}
        >
          <div className="mb-4 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">S</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">zk-SNARKs</h3>
          <p className="text-muted-foreground mb-6">
            Succinct Non-Interactive Arguments of Knowledge. Small proofs, fast verification, but requires trusted
            setup.
          </p>
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              <span className="text-sm">Proof size: ~288 bytes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              <span className="text-sm">Verification: Very fast</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              <span className="text-sm">Used by: Zcash, Ethereum</span>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90">Learn More</Button>
        </Card>

        <Card
          className="bg-card border border-border p-8 hover:border-secondary/50 transition-colors cursor-pointer"
          onClick={() => {
            setSelectedProofType("stark")
            setActiveTab("stark")
          }}
        >
          <div className="mb-4 w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
            <span className="text-secondary-foreground font-bold">T</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">zk-STARKs</h3>
          <p className="text-muted-foreground mb-6">
            Scalable Transparent Arguments of Knowledge. No trusted setup, post-quantum secure, larger proofs.
          </p>
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-sm">Proof size: ~100-200 KB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-sm">No trusted setup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-sm">Used by: StarkNet, Immutable X</span>
            </div>
          </div>
          <Button className="w-full bg-secondary hover:bg-secondary/90">Learn More</Button>
        </Card>
      </div>
    </div>
  )
}
