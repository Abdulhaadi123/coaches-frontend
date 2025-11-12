"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Shield } from "lucide-react"
import { useDialog } from "@/hooks"

interface LogoutTabProps {
  onNavigate?: (tab: string) => void
}

export function LogoutTab({ onNavigate }: LogoutTabProps) {
  const { showAlert } = useDialog()

  const handleLogout = () => {
    localStorage.removeItem('user')

    // Show logout confirmation
    showAlert({
      title: "Logout Successful",
      message: "You have been logged out successfully!",
      confirmText: "OK",
      onConfirm: () => {
        window.location.href = 'https://ws-landing-page-omega.vercel.app/login'
      }
    })
  }

  return (
    <div className="p-4 sm:p-6 space-y-6" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your account and logout securely</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* User Info Card */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Information
            </CardTitle>
            <CardDescription>Your current session details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm text-muted-foreground">user@example.com</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Role:</span>
              <span className="text-sm text-muted-foreground">Sales Representative</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Last Login:</span>
              <span className="text-sm text-muted-foreground">Today at 9:30 AM</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Secure logout and session management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              When you logout, your session will be terminated and you'll need to login again to access the application.
            </p>

            <div className="pt-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout Securely
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
