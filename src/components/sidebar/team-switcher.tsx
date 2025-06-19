"use client"

import * as React from "react"
import { ChevronsUpDown, User } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import api from "@/lib/axiosInstance"
import { toast } from "sonner"

interface Persona {
  id: string
  name: string
  avatar?: string | null
  description: string
  personality: string
}


export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const [personas, setPersonas] = React.useState<Persona[]>([])
  const [currentPersona, setCurrentPersona] = React.useState<Persona | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Fetch personas and current persona
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all personas
        const personasResponse = await api.get('/persona')
        if (personasResponse.status === 200) {
          const personasData = await personasResponse.data
          setPersonas(personasData.personas || [])
        }

        // Fetch current persona from user details
        const userDetailsResponse = await api.get('/user/user-details')
        if (userDetailsResponse.status === 200) {
          const userDetailsData = await userDetailsResponse.data
          const currentPersonaData = userDetailsData.data?.userPersona
          
          if (currentPersonaData) {
            // Find full persona details
            const fullPersona = personasResponse.data.personas?.find((p: Persona) => p.id === currentPersonaData.id)
            setCurrentPersona(fullPersona || {
              id: currentPersonaData.id,
              name: currentPersonaData.name,
              avatar: currentPersonaData.avatar,
              description: '',
              personality: ''
            })
          }
        }
      } catch (error) {
        console.error('Error fetching personas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handlePersonaChange = async (persona: Persona) => {
    try {
      const response = await api.post('/persona/set-current', {
        personaId: persona.id
      })

      if (response.status === 200) {
        setCurrentPersona(persona)
        toast.success(`Switched to persona: ${persona.name}`, {
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('Error setting current persona:', error)
    }
  }

  const handleClearPersona = async () => {
    try {
      const response = await api.post('/persona/set-current', {
        personaId: null
      })

      if (response.status === 200) {
        setCurrentPersona(null)
      }
    } catch (error) {
      console.error('Error clearing persona:', error)
    }
  }

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-200"></div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gradient-to-r data-[state=open]:from-indigo-500/10 data-[state=open]:to-purple-500/10 data-[state=open]:shadow-lg data-[state=open]:shadow-indigo-500/20 data-[state=open]:border data-[state=open]:border-indigo-500/20 transition-all duration-300 hover:bg-gradient-to-r hover:from-zinc-700/30 hover:to-zinc-600/30 rounded-lg"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 group-data-[collapsible=icon]:size-8">
                {currentPersona?.avatar ? (
                  <img 
                    src={currentPersona.avatar} 
                    alt={currentPersona.name}
                    className="size-8 rounded-lg object-cover"
                  />
                ) : (
                  <User className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentPersona?.name || "No Persona"}
                </span>
                <span className="truncate text-xs text-zinc-400">
                  {currentPersona ? "Active Persona" : "Select Persona"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto text-zinc-400 group-hover:text-zinc-300 transition-colors group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 max-w-[80vw] max-h-80 rounded-xl border-0 bg-gradient-to-br from-zinc-900/95 via-zinc-900/95 to-zinc-800/95 backdrop-blur-xl shadow-2xl shadow-black/30 p-1 flex flex-col"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-indigo-500/10 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-purple-500/10 blur-2xl"></div>
            </div>
            
            {/* Fixed Header */}
            <DropdownMenuLabel className="text-xs text-zinc-400 px-3 py-2 flex-shrink-0">
              AI Personas
            </DropdownMenuLabel>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thumb-rounded-full">
              {/* Clear persona option */}
              <DropdownMenuItem
                onClick={handleClearPersona}
                className="gap-2 p-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm mx-1"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <User className="size-4 shrink-0 text-zinc-300" />
                </div>
                No Persona
                {!currentPersona && <DropdownMenuShortcut className="text-zinc-500">✓</DropdownMenuShortcut>}
              </DropdownMenuItem>

              {personas.map((persona) => (
                <DropdownMenuItem
                  key={persona.id}
                  onClick={() => handlePersonaChange(persona)}
                  className="gap-2 p-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm mx-1"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden flex-shrink-0">
                    {persona.avatar ? (
                      <img 
                        src={persona.avatar} 
                        alt={persona.name}
                        className="size-6 object-cover"
                      />
                    ) : (
                      <User className="size-4 shrink-0 text-zinc-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-200 truncate">{persona.name}</div>
                    <div className="text-xs text-zinc-500 truncate">{persona.description}</div>
                  </div>
                  
                </DropdownMenuItem>
              ))}
            </div>
            
            {/* Fixed Footer */}
            {/* <div className="flex-shrink-0">
              <DropdownMenuSeparator className="bg-zinc-800/60 my-1" />
              <DropdownMenuItem className="gap-2 p-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm mx-1">
                <div className="flex size-6 items-center justify-center rounded-md border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <Plus className="size-4 text-zinc-300" />
                </div>
                <div className="font-medium text-zinc-300">Add persona</div>
              </DropdownMenuItem>
            </div> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
