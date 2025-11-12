"use client"

import PracticeHistoryTab from "@/components/coach/PracticeHistoryTab"

export default function PracticeHistoryPage() {
    const practiceHistory = [
        {
            id: 1,
            member: "John Smith",
            date: "2024-01-15",
            score: 85,
            scenario: "Cold Call",
            feedback: "Good opening, needs work on objection handling",
        },
        {
            id: 2,
            member: "Sarah Johnson",
            date: "2024-01-14",
            score: 92,
            scenario: "Product Demo",
            feedback: "Excellent presentation skills",
        },
        {
            id: 3,
            member: "Mike Davis",
            date: "2024-01-13",
            score: 78,
            scenario: "Closing",
            feedback: "Needs more confidence in closing techniques",
        },
    ]

    const handleApplyFilter = (filters: { dateFrom: string; dateTo: string; member: string; scenario: string; minScore: string; maxScore: string; includeInactive: boolean }) => {
        console.log("Applying filters:", filters)
        // Add logic to filter practice history
    }

    return (
        <PracticeHistoryTab
            practiceHistory={practiceHistory}
            onApplyFilter={handleApplyFilter}
        />
    )
}
