"use client"

import { useState } from "react"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  PlusCircle,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-2">
      <SidebarGroupLabel className="text-sm font-medium tracking-wide flex items-center justify-between">
        <span>Roleplay Worlds</span>
        <PlusCircle className="h-5 w-5 text-sidebar-foreground/70 hover:text-sidebar-primary cursor-pointer transition-colors duration-200" />
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem 
            key={item.name}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className="mb-1"
          >
            <SidebarMenuButton 
              asChild
              className={`transition-all duration-200 ${hoveredItem === item.name ? 'bg-sidebar-primary/10' : ''}`}
            >
              <a href={item.url}>
                <item.icon className={`h-6 w-6 ${hoveredItem === item.name ? 'text-sidebar-primary' : 'text-sidebar-foreground/80'}`} />
                <span className="font-medium">{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover className="hover:bg-sidebar-primary/20 transition-colors duration-200">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg backdrop-blur-sm"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-sidebar-primary/10 transition-colors duration-200">
                  <Folder className="mr-2 h-5 w-5 text-sidebar-primary" />
                  <span>View World</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-sidebar-primary/10 transition-colors duration-200">
                  <Forward className="mr-2 h-5 w-5 text-sidebar-primary" />
                  <span>Share World</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-destructive/10 transition-colors duration-200">
                  <Trash2 className="mr-2 h-5 w-5 text-destructive" />
                  <span className="text-destructive">Delete World</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70 hover:text-sidebar-primary hover:bg-sidebar-primary/10 transition-all duration-200">
            <MoreHorizontal className="h-6 w-6 text-sidebar-foreground/70" />
            <span>More Worlds</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
