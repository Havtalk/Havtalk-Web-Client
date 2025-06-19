"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from '@bprogress/next/app';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Pencil, Trash, Check } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axiosInstance";
import BackgroundDesign from "@/components/background-design";

interface Persona {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PersonaDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const personaId = params.personaId as string;
  
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingAsCurrent, setIsSettingAsCurrent] = useState(false);
  const [isCurrentPersona, setIsCurrentPersona] = useState(false);
  
  useEffect(() => {
    const fetchPersona = async () => {
      try {
        setIsLoading(true);
        // Fetch all personas
        const response = await api.get(`/persona`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          const personas = response.data.personas || [];
          const personaData = personas.find((p: Persona) => p.id === personaId);
          
          if (personaData) {
            setPersona(personaData);
            
            // Fetch user details to check if this is the current persona
            const userDetailsResponse = await api.get(`/user/user-details`, {
              withCredentials: true
            });
            
            if (userDetailsResponse.data.success && 
                userDetailsResponse.data.data.userPersona && 
                userDetailsResponse.data.data.userPersona.id === personaId) {
              setIsCurrentPersona(true);
            }
          } else {
            toast.error("Persona not found");
            router.push("/personas");
          }
        }
      } catch (error) {
        console.error("Error fetching persona:", error);
        toast.error("Failed to load persona data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (personaId) {
      fetchPersona();
    }
  }, [personaId, router]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await api.delete(`/persona/${personaId}`, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        toast.success("Persona deleted successfully");
        router.push("/personas");
      }
    } catch (error) {
      console.error("Error deleting persona:", error);
      toast.error("Failed to delete persona");
    } finally {
      setIsDeleting(false);
    }
  };

  const setAsCurrent = async () => {
    try {
      setIsSettingAsCurrent(true);
      const response = await api.post(`/persona/set-current`, 
        { personaId },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        toast.success("Current persona updated successfully");
        setIsCurrentPersona(true);
      }
    } catch (error) {
      console.error("Error setting current persona:", error);
      toast.error("Failed to update current persona");
    } finally {
      setIsSettingAsCurrent(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading persona data...</p>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="container py-10">
        <div className="p-6 bg-destructive/10 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-destructive mb-2">Persona Not Found</h3>
          <p className="text-muted-foreground">The persona you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
          <Button onClick={() => router.push("/personas")} variant="outline" className="mt-4">
            Back to Personas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
    <BackgroundDesign />
    <div className="container max-w-4xl py-10">
      <Card className="overflow-hidden bg-white/15 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">{persona.name}</CardTitle>
            <CardDescription>
              {isCurrentPersona ? (
                <span className="flex items-center text-green-500 font-medium">
                  <Check className="w-4 h-4 mr-1" /> Current Persona
                </span>
              ) : ""}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline" 
              size="icon"
              onClick={() => router.push(`/personas/${personaId}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Persona</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Are you sure you want to delete this persona? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel 
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-gradient-to-br from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 hover:shadow-lg text-white focus:ring-red-500 transition-all duration-200"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center">
              {persona.avatar ? (
                <div className="relative w-48 h-48 rounded-md overflow-hidden border">
                  <Image
                    src={persona.avatar}
                    alt={persona.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-muted rounded-md flex items-center justify-center">
                  <span className="text-muted-foreground">No avatar</span>
                </div>
              )}
              
              {!isCurrentPersona && (
                <Button 
                  onClick={setAsCurrent}
                  disabled={isSettingAsCurrent}
                  className="mt-4 w-full"
                  variant="secondary"
                >
                  {isSettingAsCurrent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting as Current...
                    </>
                  ) : (
                    "Set as Current Persona"
                  )}
                </Button>
              )}
            </div>
            
            <div className="md:w-2/3">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {persona.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personality</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {persona.personality}
                  </p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Created: {new Date(persona.createdAt).toLocaleDateString()}</p>
                  <p>Last updated: {new Date(persona.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-4 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => router.push("/personas")}
          >
            Back to Personas
          </Button>
          <Button
            onClick={() => router.push(`/personas/${personaId}/edit`)}
          >
            Edit Persona
          </Button>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}
