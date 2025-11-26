"use client"

import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import type { DashboardTab } from "@/types/tabs"

interface HeroProps {
  setActiveTab: Dispatch<SetStateAction<DashboardTab>>
}

export default function Hero({ setActiveTab }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-card to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Zero-Knowledge Proofs Explained</h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Explore the cryptographic revolution enabling privacy-preserving transactions and scalable blockchain
            solutions. Learn about zk-SNARKs, zk-STARKs, and their real-world applications.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setActiveTab("snark")}>
              Try Proof Generator
            </Button>
            <Button size="lg" variant="outline" onClick={() => setActiveTab("hybrid")}>
              Compare Platforms
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
