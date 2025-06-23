"use client"

import { ChevronRight, Home, Sparkles, User, VenetianMask, type LucideIcon } from "lucide-react"
import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel className="text-sm font-medium tracking-wide">
        AI Characters
      </SidebarGroupLabel> */}
      <SidebarMenu>
        <SidebarMenuItem className="mb-2">
          <SidebarMenuButton
            tooltip="Home"
            asChild
            className="transition-all duration-200 hover:bg-sidebar-primary/10 hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            <Link href="/dashboard">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                <Home className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
              </div>
              <span className="font-medium group-data-[collapsible=icon]:sr-only">
                Home
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="mb-2">
          <SidebarMenuButton
            tooltip="Explore Characters"
            asChild
            className="transition-all duration-200 hover:bg-sidebar-primary/10 hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            <Link href="/characters">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                <Sparkles className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
              </div>
              <span className="font-medium group-data-[collapsible=icon]:sr-only">
                Explore Characters
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="mb-2">
          <SidebarMenuButton
            tooltip="My Personas"
            asChild
            className="transition-all duration-200 hover:bg-sidebar-primary/10 hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            <Link href="/personas">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                <VenetianMask className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
              </div>
              <span className="font-medium group-data-[collapsible=icon]:sr-only">
                My Personas
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible mb-1.5"
          >
            <SidebarMenuItem
              onMouseEnter={() => setHoveredItem(item.title)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 ${
                    hoveredItem === item.title ? "bg-sidebar-primary/10" : ""
                  }`}
                >
                  {item.icon && (
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-lg transition-all duration-200 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 ${
                        item.title === "My Characters"
                          ? "bg-gradient-to-br from-indigo-500 to-indigo-600"
                          : item.title === "Settings"
                          ? "bg-gradient-to-br from-gray-500 to-gray-600"
                          : "bg-gradient-to-br from-slate-500 to-slate-600"
                      }`}
                    >
                      <item.icon className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                    </div>
                  )}
                  <span className="font-medium group-data-[collapsible=icon]:sr-only">
                    {item.title}
                  </span>
                  <ChevronRight className="ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem
                      key={subItem.title}
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <SidebarMenuSubButton asChild className="py-1.5">
                        <a href={subItem.url}>
                          <span className="text-sm">{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}

        <SidebarMenuItem className="mb-2">
          <SidebarMenuButton
            tooltip="My Profile"
            asChild
            className="transition-all duration-200 hover:bg-sidebar-primary/10 hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          >
            <Link href="/profile">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                <User className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
              </div>
              <span className="font-medium group-data-[collapsible=icon]:sr-only">
                My Profile
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
