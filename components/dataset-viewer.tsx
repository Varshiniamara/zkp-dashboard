"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DatasetViewer() {
    const [users, setUsers] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDataset()
    }, [])

    const loadDataset = async () => {
        try {
            // Try to load from API first, fallback to local file
            const apiClient = (await import('@/lib/api-client')).default;
            const result = await apiClient.getDataset(1, 100);
            
            if (result.success && result.data) {
                setUsers(result.data.data || [])
                setLoading(false)
            } else {
                // Fallback to local JSON file
                fetch('/test/data/users.json')
                    .then(res => res.json())
                    .then(data => {
                        setUsers(data)
                        setLoading(false)
                    })
                    .catch(err => {
                        console.error('Error loading dataset:', err)
                        setLoading(false)
                    })
            }
        } catch (error) {
            console.error('Error loading dataset from API:', error)
            // Fallback to local JSON file
            fetch('/test/data/users.json')
                .then(res => res.json())
                .then(data => {
                    setUsers(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error('Error loading dataset:', err)
                    setLoading(false)
                })
        }
    }

    const handleSelectUser = (user: any) => {
        setSelectedUser(user)
    }

    const handleUseInProof = (user: any) => {
        // This will be used to populate the proof generator form
        const event = new CustomEvent('loadUserData', { detail: user })
        window.dispatchEvent(event)
        alert(`User ${user.user_id} data loaded! Navigate to SNARK/STARK tab to generate proof.`)
    }

    if (loading) {
        return <div className="container mx-auto px-4 py-12">Loading dataset...</div>
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">Dataset Viewer</h1>
                <p className="text-muted-foreground mb-8">
                    Browse and select from 100 synthetic users for ZKP generation
                </p>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* User List */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card border border-border overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h2 className="text-xl font-bold">Users ({users.length})</h2>
                            </div>
                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-muted/30 border-b border-border">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Age</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Country</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Credit</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Eligible</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr
                                                key={user.user_id}
                                                className={`border-b border-border hover:bg-muted/20 transition-colors cursor-pointer ${selectedUser?.user_id === user.user_id ? 'bg-muted/40' : ''
                                                    }`}
                                                onClick={() => handleSelectUser(user)}
                                            >
                                                <td className="px-4 py-3 text-sm">{user.user_id}</td>
                                                <td className="px-4 py-3 text-sm">{user.name}</td>
                                                <td className="px-4 py-3 text-sm">{user.age}</td>
                                                <td className="px-4 py-3 text-sm">{user.country}</td>
                                                <td className="px-4 py-3 text-sm">{user.credit_score}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs ${user.eligible_for_loan ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {user.eligible_for_loan ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleUseInProof(user)
                                                        }}
                                                    >
                                                        Use
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Selected User Details */}
                    <div>
                        {selectedUser ? (
                            <Card className="bg-card border border-border p-6 sticky top-20">
                                <h2 className="text-lg font-bold mb-4">User Details</h2>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">User ID</p>
                                        <p className="text-sm font-semibold">{selectedUser.user_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Name</p>
                                        <p className="text-sm font-semibold">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Age (STARK)</p>
                                        <p className="text-sm font-semibold">{selectedUser.age}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Country (STARK)</p>
                                        <p className="text-sm font-semibold">{selectedUser.country}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Salary (SNARK)</p>
                                        <p className="text-sm font-semibold">${selectedUser.salary.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Credit Score (SNARK)</p>
                                        <p className="text-sm font-semibold">{selectedUser.credit_score}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Balance (SNARK)</p>
                                        <p className="text-sm font-semibold">${selectedUser.balance.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tx Count (Rollup)</p>
                                        <p className="text-sm font-semibold">{selectedUser.tx_count}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Loan Eligible</p>
                                        <p className={`text-sm font-semibold ${selectedUser.eligible_for_loan ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {selectedUser.eligible_for_loan ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                    <Button
                                        className="w-full mt-4"
                                        onClick={() => handleUseInProof(selectedUser)}
                                    >
                                        Use in Proof Generator
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card className="bg-card border border-border p-6 text-center">
                                <p className="text-muted-foreground">Select a user to view details</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
