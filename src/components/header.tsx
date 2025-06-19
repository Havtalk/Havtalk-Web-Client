'use client';
import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from './ui/avatar';
import { LogOut, Plus, Inbox, VenetianMask, Ghost, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useSession,signOut } from '@/lib/auth';
import { AvatarImage } from '@radix-ui/react-avatar';

function Header() {
    const { data: session } = useSession();
    const userName = session?.user?.name || 'User';
    const userEmail = session?.user?.email || 'example@gmail.com'
    const userInitial = userName.charAt(0).toUpperCase();
    const userAvatar = session?.user?.image; 
    const isLoggedIn = !!session;
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 px-6">
            <SidebarTrigger className="-ml-1 h-8 w-8 rounded-lg hover:bg-zinc-800/60 text-zinc-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:shadow-md hover:shadow-zinc-900/50" />
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent opacity-60"></div>
            
        </div>
        <div className="flex items-center gap-3 px-6">
            <Link href="/characters/create-character">
                <Button variant="ghost" className="hidden md:flex h-10 px-4 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 hover:from-zinc-700/80 hover:to-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
                    <Ghost size={16} className="mr-2" />
                    <span className="font-medium">New Character</span>
                </Button>
            </Link>
            <Link href="/personas/create-persona">
                <Button variant="ghost" className="hidden md:flex h-10 px-4 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 hover:from-zinc-700/80 hover:to-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
                    <VenetianMask size={16} className="mr-2" />
                    <span className="font-medium">New Persona</span>
                </Button>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger className="md:hidden h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 hover:from-zinc-700/80 hover:to-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center border border-zinc-700/50 hover:border-indigo-500/30">
                    <Plus size={18} className="text-zinc-300 hover:text-white transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 overflow-hidden border-0 bg-gradient-to-br from-zinc-900/90 via-zinc-900/90 to-zinc-800/90 drop-shadow-xs text-zinc-200 rounded-2xl shadow-xl shadow-black/30 p-0">
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                        <Link href="/characters/create-character">
                            <DropdownMenuItem className="group flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 backdrop-blur-sm">
                                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Ghost size={16} className="text-white" />
                                </div>
                                <span className="font-medium">Create Character</span>
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/personas/create-persona">
                            <DropdownMenuItem className="group flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 backdrop-blur-sm">
                                <div className="p-1.5 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <VenetianMask size={16} className="text-white" />
                                </div>
                                <span className="font-medium">Create Persona</span>
                            </DropdownMenuItem>
                        </Link>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent opacity-60"></div>
            
            {isLoggedIn ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-10 w-10 rounded-full hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 flex items-center justify-center">
                        <Avatar className="border-2 border-zinc-700/70 h-10 w-10 group-hover:border-indigo-500/50 transition-all duration-300 shadow-md shadow-black/20">
                            <AvatarImage src={userAvatar as string} alt={userName} className="rounded-full" />
                            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
                                {userInitial}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" 
                        className="w-56 overflow-hidden border-0 bg-gradient-to-br from-zinc-900/95 via-zinc-900 to-zinc-800/95 text-zinc-200 rounded-xl shadow-xl shadow-black/30 p-0 animate-in fade-in-50 zoom-in-95 duration-200"
                        sideOffset={8}>
                        <div className="relative">
                            <div className="absolute -top-20 -right-16 w-32 h-32 rounded-full bg-indigo-600/10 blur-3xl opacity-60"></div>
                            <div className="absolute -bottom-20 -left-16 w-32 h-32 rounded-full bg-blue-600/10 blur-3xl opacity-60"></div>
                        </div>
                        <Link href="/profile">
                            <div className="px-3 pt-3 pb-2 flex items-center gap-3 border-b border-zinc-800/60 relative cursor-pointer hover:bg-white/5">
                                <Avatar className="h-9 w-9 ring-2 ring-indigo-500/20 ring-offset-1 ring-offset-zinc-900">
                                    <AvatarImage src={userAvatar as string} alt={userName} className="rounded-full" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-sm font-semibold">
                                        {userInitial}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-medium text-white truncate">{userName}</span>
                                    <span className="text-xs text-zinc-400/90 truncate">{userEmail}</span>
                                </div>
                            </div>
                        </Link>
                        
                        <div className="p-2 space-y-0.5">
                            {/* <DropdownMenuItem className="group flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm">
                                <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md group-hover:scale-110 transition-transform duration-300 shadow-md shadow-indigo-500/20">
                                    <User size={14} className="text-white" />
                            </div>
                            <span className="font-medium text-sm">Profile</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className="group flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm">
                            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md group-hover:scale-110 transition-transform duration-300 shadow-md shadow-blue-500/20">
                                <Settings size={14} className="text-white" />
                            </div>
                            <span className="font-medium text-sm">Settings</span>
                        </DropdownMenuItem> */}
                            <Link href="/characters/personal">
                                <DropdownMenuItem className="group flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm">
                                    <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-md group-hover:scale-110 transition-transform duration-300 shadow-md shadow-emerald-500/20">
                                        <Ghost size={14} className="text-white" />
                                    </div>
                                    <span className="font-medium text-sm">My Characters</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/personas">
                                <DropdownMenuItem className="group flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm">
                                    <div className="p-1.5 bg-gradient-to-br from-purple-500 to-violet-500 rounded-md group-hover:scale-110 transition-transform duration-300 shadow-md shadow-purple-500/20">
                                        <VenetianMask size={14} className="text-white" />
                                    </div>
                                    <span className="font-medium text-sm">My Personas</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/characters/personal/requests">
                                <DropdownMenuItem className="group flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm">
                                    <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md group-hover:scale-110 transition-transform duration-300 shadow-md shadow-amber-500/20">
                                        <Inbox size={14} className="text-white" />
                                    </div>
                                    <span className="font-medium text-sm">My Requests</span>
                                </DropdownMenuItem>
                            </Link>
                        </div>
                        
                        <div className="px-2 pb-2">
                            <DropdownMenuItem className="group bg-gradient-to-br from-rose-500 to-red-500 hover:to-purple-500/80 text-white flex items-center gap-2.5 px-2.5 py-1 hover:bg-rose-500/10 rounded-lg transition-all duration-200 backdrop-blur-sm mt-1 border-t border-zinc-800/40" onClick={() => signOut()}>
                                <div className="p-1.5  rounded-md group-hover:scale-110 transition-transform duration-300 shadow-md shadow-rose-500/20">
                                    <LogOut size={14} className="text-white font-medium" />
                                </div>
                                <span className="font-medium text-sm text-white">Logout</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href="/auth/login">
                    <Button variant="ghost" className="h-10 px-4 rounded-xl bg-gradient-to-br from-indigo-600/80 to-purple-600/80 hover:from-indigo-500/80 hover:to-purple-500/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 text-white font-medium">
                        <LogIn size={16} className="mr-1 font-medium" />
                        <span>Login</span>
                    </Button>
                </Link>
            )}
        </div>
    </header>
  )
}

export default Header;