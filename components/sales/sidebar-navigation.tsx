"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Phone, LogOut, BookOpen } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/sales" },
  { id: "playbooks", label: "Playbooks", icon: BookOpen, href: "/sales/playbooks" },
  { id: "call-simulation", label: "Call Simulation", icon: Phone, href: "/sales/call-simulation" },
  { id: "logout", label: "Logout", icon: LogOut, href: "/sales/logout" },
]

interface SidebarNavigationProps {
  onCloseSidebar?: () => void
}

export function SidebarNavigation({ onCloseSidebar }: SidebarNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
    // Close sidebar on mobile after navigation
    onCloseSidebar?.()
  }
  return (
    <div className="bg-white border-r border-sidebar-border h-screen flex flex-col w-64">
      {/* Header - Hidden on mobile since we have mobile header */}
      <div className="hidden  lg:block p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <img src="/images/ws-only.png" alt="Woodward Strategies" className="h-8 w-auto" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Sales Training</h1>
        </Link>
      </div>

      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <img src="/images/ws-only.png" alt="Woodward Strategies" className="h-8 w-auto" />
          <h1 className="text-xl font-bold text-sidebar-foreground">Sales Training</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href

          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => handleNavigation(tab.href)}
              className={cn(
                "w-full justify-start gap-3 h-12 text-left transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-sidebar-foreground hover:bg-gray-50 hover:text-gray-900",
                isActive && "hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </Button>
          )
        })}
      </nav>
    </div >
  )
}
