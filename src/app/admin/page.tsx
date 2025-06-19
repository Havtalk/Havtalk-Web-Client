"use client";
import Link from 'next/link';
import {Sparkles, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage Havtalk properly</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Character Showcase Card */}
          <Link href="/admin/character-showcase" className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Character Showcase</CardTitle>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>Manage characters featured on the platform</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Add, remove, and edit AI characters that are displayed to users. Control which characters are active and featured.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Manage Characters</Button>
              </CardFooter>
            </Card>
          </Link>
          
          {/* User Requests Card */}
          <Link href="/admin/user-requests" className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>User Requests</CardTitle>
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>Review and process user requests</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Manage user requests for character publishing, content moderation, and feature access.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Requests</Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
