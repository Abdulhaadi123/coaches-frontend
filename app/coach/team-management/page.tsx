"use client"

import { useTeamMembers, useAddRep, useRemoveRep } from "@/hooks/use-team-members"
import TeamManagementTab from "@/components/coach/TeamManagementTab"

export default function TeamManagementPage() {
    const { data: teamMembers = [], isLoading } = useTeamMembers()
    const addRep = useAddRep()
    const removeRep = useRemoveRep()

    const formattedMembers = teamMembers.map((member: any) => ({
        id: member._id,
        name: member.name,
        email: member.email,
        role: "Sales Rep",
        score: 0,
        status: member.isEmailVerified ? "Active" : "Pending"
    }))

    const handleAddNewRep = (repData: { name: string; email: string; phone: string }) => {
        addRep.mutate(repData)
    }

    const handleRemoveRep = (memberId: number) => {
        removeRep.mutate(memberId.toString())
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading team members...</p>
                </div>
            </div>
        )
    }

    return (
        <TeamManagementTab
            teamMembers={formattedMembers}
            onAddNewRep={handleAddNewRep}
            onRemoveRep={handleRemoveRep}
        />
    )
}
