import Header from "@/components/header"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar/>
        <SidebarInset className="flex flex-col w-full min-w-0">
          <Header/>
          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-gray-800/70">
            <div className="h-full w-full relative">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}