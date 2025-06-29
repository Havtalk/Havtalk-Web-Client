"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import axios from "axios";
// import { BaseUrl } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Plus} from "lucide-react";
import PersonaCard from "@/components/persona-card";
import BackgroundDesign from "@/components/background-design";
import { PersonaCardSkeleton } from "@/components/skeletons/persona-card-skeleton";
import api from "@/lib/axiosInstance";

interface Persona {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

// Add user details interface
interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    bio: string | null;
    personality: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      username?: string;
      avatar?: string;
    };
    userPersona?: {
      id: string;
      name: string;
      avatar?: string;
    } | null;
  };
}

// Define a proper error type to use instead of any
interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message: string;
}

export default function PersonasPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null);
  
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Fetch user details first to get the current persona ID
    fetchUserDetails();
  }, []);
  useEffect(() => {
      const checkScreenSize = () => {
        setIsSmallScreen(window.innerWidth <= 400); 
      };
      checkScreenSize(); // Initial check
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<UserDetailsResponse>(
        `/user/user-details`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.data.userPersona) {
        // Set current persona ID from the user details response
        const personaId = response.data.data.userPersona.id;
        setCurrentPersonaId(personaId);
        
        // Now fetch personas with the current persona ID
        await fetchPersonas(personaId);
      } else {
        // If no current persona, still fetch personas
        await fetchPersonas(null);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch user details:", err);
      // If we can't get user details, still try to fetch personas
      await fetchPersonas(null);
    }
  };

  const fetchPersonas = async (currentId: string | null = null) => {
    try {
      // Use the passed ID or fall back to the state value
      const activePersonaId = currentId !== null ? currentId : currentPersonaId;
      
      const response = await api.get(`/persona`, {
        withCredentials: true,
      });
      let fetchedPersonas = response.data.personas || [];
      
      // Move selected persona to the front if exists
      if (activePersonaId) {
        const idx = fetchedPersonas.findIndex((p: Persona) => p.id === activePersonaId);
        if (idx > -1) {
          const [selected] = fetchedPersonas.splice(idx, 1);
          fetchedPersonas = [selected, ...fetchedPersonas];
        }
      }
      
      setPersonas(fetchedPersonas);
    } catch (err: unknown) {
      console.error("Failed to fetch personas:", err);
      // Cast to ApiError type to access properties safely
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || "Failed to load personas");
      toast.error("Failed to load personas");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle persona selection state update
  const handlePersonaSelected = (id: string | null) => {
    setCurrentPersonaId(id);
    
    // Reorder personas immediately with the new ID
    if (id) {
      setPersonas(prevPersonas => {
        const idx = prevPersonas.findIndex(p => p.id === id);
        if (idx > -1) {
          const newPersonas = [...prevPersonas];
          const [selected] = newPersonas.splice(idx, 1);
          return [selected, ...newPersonas];
        }
        return prevPersonas;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full pb-16 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950">
        <BackgroundDesign />
        <div className="container mx-auto px-2 md:px-8 pt-16 md:pt-20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl sm:text-3xl font-bold text-center sm:text-left">Your Personas</h1>
            <Button 
              onClick={() => router.push("/personas/create-persona")} 
              className="hidden sm:flex items-center gap-2 mt-4 sm:mt-0"
            >
              <Plus className="h-4 w-4" />
              Create New Persona
            </Button>
          </div>
          
          {/* Show skeleton loaders while loading */}
          <div className={`grid justify-center gap-2 ${isSmallScreen?'grid-cols-[repeat(auto-fill,9rem)]':'grid-cols-[repeat(auto-fill,11rem)]'} sm:gap-4`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <PersonaCardSkeleton key={index} isSmallScreen={isSmallScreen} />
            ))}
          </div>
        </div>
        
        {/* Floating action button for mobile */}
        <div className="sm:hidden fixed bottom-10 right-6 z-50">
          <Button 
            onClick={() => router.push("/personas/create-persona")} 
            className="rounded-full p-3 h-auto w-auto"
            size="icon"
          >
            <Plus className="h-5 w-5" /> 
            <span className="">Create New Persona</span>
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="p-6 bg-destructive/10 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Personas</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => fetchPersonas()} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-16 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950">
      <BackgroundDesign />
      <div className="container mx-auto px-2 md:px-8 pt-16 md:pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-3xl font-bold text-center sm:text-left">Your Personas</h1>
          <Button 
            onClick={() => router.push("/personas/create-persona")} 
            className="hidden sm:flex items-center gap-2 mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4" />
            Create New Persona
          </Button>
        </div>

        {personas.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-lg bg-muted/40">
            <h3 className="text-xl font-medium mb-2">No personas found</h3>
            <p className="text-muted-foreground mb-6">
              Create your first persona to get started
            </p>
            <Button onClick={() => router.push("/personas/create-persona")}>
              Create Your First Persona
            </Button>
          </div>
        ) : (
          <div className={`grid justify-center gap-2 ${isSmallScreen?'grid-cols-[repeat(auto-fill,9rem)]':'grid-cols-[repeat(auto-fill,11rem)]'} sm:gap-4`}>
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={currentPersonaId === persona.id}
                onPersonaSelected={handlePersonaSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating action button for mobile */}
      <div className="sm:hidden fixed bottom-10 right-6 z-50">
        <Button 
          onClick={() => router.push("/personas/create-persona")} 
          className="rounded-full p-3 h-auto w-auto"
          size="icon"
        >
          <Plus className="h-5 w-5" /> 
          <span className="">Create New Persona</span>
        </Button>
      </div>
    </div>
  );
}
