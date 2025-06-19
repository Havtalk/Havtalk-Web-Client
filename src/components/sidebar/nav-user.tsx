"use client"

import {
  LogOut,
  // Sparkles,
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUser({
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                <LogOut className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                Logout
              </div>
              {/* <Link href="/dashboard">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                <LogOut className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
              </div>
              <span className="font-medium group-data-[collapsible=icon]:sr-only">
                Home
              </span>
            </Link> */}
            </SidebarMenuButton>
          
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
