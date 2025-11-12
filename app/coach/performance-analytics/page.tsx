"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import PerformanceAnalyticsTab from "@/components/coach/PerformanceAnalyticsTab"

export default function PerformanceAnalyticsPage() {
    const [teamMembers, setTeamMembers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadTeamMembers()
    }, [])

    const loadTeamMembers = async () => {
        try {
            const response = await api.getTeamMembers()
            if (response.success) {
                const formattedMembers = response.teamMembers.map((member: any) => ({
                    id: member._id,
                    name: member.name,
                    email: member.email,
                    role: "Sales Rep",
                    score: 0,
                    status: member.isEmailVerified ? "Active" : "Pending"
                }))
                setTeamMembers(formattedMembers)
            }
        } catch (error) {
            console.error('Failed to load team members:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        )
    }

    return (
        <PerformanceAnalyticsTab teamMembers={teamMembers} />
    )
}
