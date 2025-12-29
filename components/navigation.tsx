"use client"

import Link from "next/link"
import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import type { DashboardTab } from "@/types/tabs"

interface NavigationProps {
  activeTab: DashboardTab
  setActiveTab: Dispatch<SetStateAction<DashboardTab>>
}

const navItems: { id: DashboardTab; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "demo", label: "🚀 Demo", href: "/demo" },
  { id: "snark", label: "zk-SNARK", href: "/demo?tab=snark" },
  { id: "stark", label: "zk-STARK", href: "/demo?tab=stark" },
  { id: "rollup", label: "zk-Rollup", href: "/demo?tab=rollup" },
  { id: "hybrid", label: "Hybrid Flow", href: "/demo?tab=hybrid" },
]

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ZK</span>
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">ZKP Dashboard</span>
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={() => setActiveTab(item.id)}>
              <Button
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                className={
                  activeTab === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
