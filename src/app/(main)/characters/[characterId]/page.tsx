"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageSquare, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
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
import api from "@/lib/axiosInstance";
import BackgroundDesign from "@/components/background-design";

// Define a proper type for example dialogues
interface ExampleDialogue {
  user: string;
  ai: string;
}

// Update the Character interface to better handle exampleDialogues
interface Character {
  id: string;
  name: string;
  personality: string;
  description: string;
  avatar: string | null;
  environment: string | null;
  additionalInfo: string | null;
  tags: string[];
  backstory: string | null;
  role: string | null;
  goals: string | null;
  quirks: string | null;
  tone: string | null;
  speechStyle: string | null;
  exampleDialogues: ExampleDialogue[] | string | null; // Now properly typed
  isPublic: boolean;
  ownerId: string;
}

// Add a helper function to safely parse and handle exampleDialogues
const parseExampleDialogues = (dialogues: ExampleDialogue[] | string | null): ExampleDialogue[] => {
  if (!dialogues) return [];
  
  try {
    // If it's a string, try to parse it
    if (typeof dialogues === 'string') {
      return JSON.parse(dialogues);
    }
    
    // If it's already an array, return it
    if (Array.isArray(dialogues)) {
      return dialogues;
    }
    
    // For any other type, return an empty array
    return [];
  } catch (error) {
    console.error("Error parsing example dialogues:", error);
    return [];
  }
};

export default function CharacterDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = params.characterId as string;
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const hasAdvancedFields = (char: Character): boolean => {
    return !!(
      char.environment || 
      char.backstory || 
      char.role || 
      char.goals || 
      char.quirks || 
      char.tone || 
      char.speechStyle || 
      char.additionalInfo || 
      (char.exampleDialogues && parseExampleDialogues(char.exampleDialogues).length > 0)
    );
  };
  
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/character/${characterId}`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          // Convert empty strings to null for consistency
          const characterData = response.data.character;
          
          // Process the character data to ensure empty strings are null
          const processedCharacter = {
            ...characterData,
            environment: characterData.environment || "null",
            avatar: characterData.avatar || null,
            additionalInfo: characterData.additionalInfo || "null",
            backstory: characterData.backstory || "null",
            role: characterData.role || "null",
            goals: characterData.goals || "null",
            quirks: characterData.quirks || "null",
            tone: characterData.tone || "null",
            speechStyle: characterData.speechStyle || "null",
            tags: characterData.tags || []
          };
          
          setCharacter(processedCharacter);
          
          // Set activeTab to basic if no advanced fields
          if (!hasAdvancedFields(processedCharacter)) {
            setActiveTab("basic");
          }
        }
      } catch (error) {
        console.error("Error fetching character:", error);
        toast.error("Failed to load character data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (characterId) {
      fetchCharacter();
    }
  }, [characterId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await api.delete(`/character/${characterId}`, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        toast.success("Character deleted successfully");
        router.push("/characters");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Failed to delete character");
    } finally {
      setIsDeleting(false);
    }
  };

  const startChat = () => {
    // Implement chat functionality here
    router.push(`/chat/${characterId}`);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading character...</span>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Character not found or you don&apos;t have permission to view it.</p>
      </div>
    );
  }

  return (
    <>
    <BackgroundDesign />
    <div className="h-full w-full flex justify-center py-10 overflow-y-auto px-2">
      <Card className="border-none shadow-md w-full max-w-4xl min-h-fit bg-white/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-3xl">{character.name}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push(`/characters/${characterId}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Delete Character</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Are you sure you want to delete this character? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
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
        
        <CardContent className="pt-6">
          {character && hasAdvancedFields(character) ? (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "advanced")}>
              <div className="flex justify-end mb-6">
                <TabsList className="bg-transparent border-b-0">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="basic" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Personality</h3>
                      <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                        {character.personality || "No personality specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Description</h3>
                      <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                        {character.description || "No description provided"}
                      </p>
                    </div>
                    
                    {character.tags && character.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {character.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-muted rounded-md text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium">Status</h3>
                      <div className="flex items-center mt-1">
                        <span 
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            character.isPublic ? "bg-green-500" : "bg-orange-500"
                          }`}
                        ></span>
                        <span className="text-muted-foreground">
                          {character.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {character.avatar ? (
                      <div className="relative w-full max-w-[250px] aspect-square mx-auto">
                        <Image
                          src={character.avatar}
                          alt={character.name}
                          className="rounded-md object-cover border"
                          fill
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-[250px] aspect-square mx-auto bg-muted rounded-md flex items-center justify-center">
                        <span className="text-muted-foreground">No avatar</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <div className="space-y-8">
                  {/* Character Context Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Character Context</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {character.environment && (
                          <div>
                            <h4 className="text-lg font-medium">Environment</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.environment}
                            </p>
                          </div>
                        )}
                        
                        {character.role && (
                          <div>
                            <h4 className="text-lg font-medium">Role</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.role}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {character.backstory && (
                          <div>
                            <h4 className="text-lg font-medium">Backstory</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.backstory}
                            </p>
                          </div>
                        )}
                        
                        {character.goals && (
                          <div>
                            <h4 className="text-lg font-medium">Goals</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.goals}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Speech & Behavior Section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Speech & Behavior</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {character.quirks && (
                          <div>
                            <h4 className="text-lg font-medium">Quirks</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.quirks}
                            </p>
                          </div>
                        )}
                        
                        {character.tone && (
                          <div>
                            <h4 className="text-lg font-medium">Tone</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.tone}
                            </p>
                          </div>
                        )}
                        
                        {character.speechStyle && (
                          <div>
                            <h4 className="text-lg font-medium">Speech Style</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.speechStyle}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {character.additionalInfo && (
                          <div>
                            <h4 className="text-lg font-medium">Additional Info</h4>
                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                              {character.additionalInfo}
                            </p>
                          </div>
                        )}
                        
                        {character.exampleDialogues && (
                          <div>
                            <h4 className="text-lg font-medium">Example Dialogues</h4>
                            <div className="mt-2 space-y-2 border rounded-md p-3 bg-muted/50">
                              {parseExampleDialogues(character.exampleDialogues).map((dialogue, index) => (
                                <div key={index} className="space-y-1">
                                  <p className="font-medium text-sm">User: {dialogue.user}</p>
                                  <p className="text-sm">{dialogue.ai}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* Only render basic tab content without the tabs UI if no advanced fields */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Personality</h3>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                      {character.personality || "No personality specified"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                      {character.description || "No description provided"}
                    </p>
                  </div>
                  
                  {character.tags && character.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {character.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-muted rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium">Status</h3>
                    <div className="flex items-center mt-1">
                      <span 
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          character.isPublic ? "bg-green-500" : "bg-orange-500"
                        }`}
                      ></span>
                      <span className="text-muted-foreground">
                        {character.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  {character.avatar ? (
                    <div className="relative w-full max-w-[250px] aspect-square mx-auto">
                      <Image
                        src={character.avatar}
                        alt={character.name}
                        className="rounded-md object-cover border"
                        fill
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-[250px] aspect-square mx-auto bg-muted rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">No avatar</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="default"
            onClick={startChat}
            className="flex items-center"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Chat
          </Button>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}
