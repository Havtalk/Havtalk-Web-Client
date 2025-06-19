"use client"

import * as React from "react"
import {
  BookOpen,
  Ghost,
  LogIn,
  LogOut,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// HavTalk AI data
import { 
  Heart, 

  Zap, 
  MessageSquareHeart, 
  Crown, 
  Palette, 
  Bot,
  Rocket,
  Shield
} from "lucide-react"
import { signOut, useSession } from "@/lib/auth"
import Link from "next/link"

const data = {
  user: {
    name: "Soham",
    email: "soham@example.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "HavTalk",
      logo: Zap,
      plan: "Premium",
    },
    {
      name: "Creative Studio",
      logo: Palette,
      plan: "Pro Creator",
    },
    {
      name: "Roleplay Hub",
      logo: Heart,
      plan: "Community",
    },
  ],  
  navMain: [
    {
      title: "My Characters",
      url: "/my-characters",
      icon: Ghost,
      isActive: true,
      items: [
        {
          title: "All Characters",
          url: "/characters/personal",
        },
        {
          title: "Favourites",
          url: "/characters/favourites",
        },
        {
          title: "Create New",
          url: "/characters/create-character",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Fantasy Realms",
      url: "/realms/fantasy",
      icon: Crown,
    },
    {
      name: "Sci-Fi Worlds",
      url: "/realms/scifi",
      icon: Rocket,
    },
    {
      name: "Historical Eras",
      url: "/realms/historical",
      icon: BookOpen,
    },
  ],
}

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const session=useSession();
  const isAdmin = session?.data?.user.role=='admin' || false;
  const isLoggedIn = !!session.data?.user;
  const isPending=session.isPending;
  return (
    <Sidebar 
      collapsible="icon" 
            className={`transition-all duration-300 ease-in-out border-none bg-gradient-to-b from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 backdrop-blur-xl shadow-xl shadow-black/20 scrollbar-thin scrollbar-track-transparent ${className || ""}`}
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border/10">
        <TeamSwitcher/>
      </SidebarHeader>
      <SidebarContent className="pb-4">
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {isAdmin&&(<SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium tracking-wide">
            Admin
          </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  tooltip="Admin Dashboard"
                  asChild
                  className="transition-all duration-200 hover:bg-sidebar-primary/10 hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
                >
                  <a href="/admin">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                      <Shield className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                    </div>
                    <span className="font-medium group-data-[collapsible=icon]:sr-only">Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  tooltip="Manage Characters"
                  asChild
                  className="transition-all duration-200 hover:bg-sidebar-primary/10 hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
                >
                  <a href="/admin/character-showcase">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                      <Bot className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                    </div>
                    <span className="font-medium group-data-[collapsible=icon]:sr-only">Character Showcase</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                  tooltip="User Requests"
                  asChild
                  className="transition-all duration-200 hover:bg-sidebar-primary/10 hover:translate-x-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
                >
                  <a href="/admin/user-requests">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
                      <MessageSquareHeart className="h-5 w-5 text-white group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                    </div>
                    <span className="font-medium group-data-[collapsible=icon]:sr-only">User Requests</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>)}

      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/10 list-none">
        <SidebarMenuItem className="mb-2">
          {isPending ? (
            <div className="rounded-2xl bg-gradient-to-br from-gray-600/50 to-gray-700/50 animate-pulse h-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
              <div className="flex items-center justify-center h-full space-x-2 group-data-[collapsible=icon]:space-x-0 px-2">
                {/* <div className="w-5 h-5 bg-gray-400/50 rounded animate-pulse"></div> */}
                <div className="w-full h-6 bg-gray-400/50 rounded-full animate-pulse group-data-[collapsible=icon]:sr-only"></div>
              </div>
            </div>
          ) : isLoggedIn ? (
            <SidebarMenuButton
              tooltip="Logout"
              asChild
              onClick={() => signOut()}
              className="rounded-2xl hover:bg-sidebar-primary/10 hover:translate-x-0.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 bg-gradient-to-br from-rose-500 to-red-500 hover:to-purple-500/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 text-white font-medium"
            >
                <button className="flex items-center justify-center space-x-1 group-data-[collapsible=icon]:space-x-0">
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:sr-only">Logout</span>
                </button>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              tooltip="Login"
              asChild
              className="rounded-2xl hover:bg-sidebar-primary/10 hover:translate-x-0.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 bg-gradient-to-br from-indigo-600/80 to-purple-600/80 hover:from-indigo-500/80 hover:to-purple-500/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 text-white font-medium"
            >
              <Link href="/auth/login" className="flex items-center justify-center w-full">
                <div className="flex items-center justify-center space-x-1">
                  <LogIn className="h-5 w-5 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:sr-only">Login</span>
                </div>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail className="bg-sidebar-primary/5" />
    </Sidebar>
  )
}
