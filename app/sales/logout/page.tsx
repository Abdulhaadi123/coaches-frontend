"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useConfirmation } from "@/hooks"
import { toast } from "sonner"

export default function LogoutPage() {
  const router = useRouter()
  const { confirmLogout, ConfirmationComponent } = useConfirmation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    confirmLogout(async () => {
      try {
        setIsLoggingOut(true)
        await api.logout()
        toast.success("Logged out successfully")
        // Use window.location to force full page reload and clear cache
        window.location.href = '/login'
      } catch (err) {
        toast.error("Logout failed")
        setIsLoggingOut(false)
        setShowModal(false)
        setTimeout(() => router.push('/sales'), 300)
      }
    }, () => {
      // On cancel, redirect back to sales dashboard
      setShowModal(false)
      setTimeout(() => router.push('/sales'), 300)
    })
  }, [confirmLogout, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {showModal && ConfirmationComponent}
      {isLoggingOut && <p className="text-muted-foreground">Logging out...</p>}
    </div>
  )
}
