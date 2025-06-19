"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Loader2, CheckCircle2, X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs,TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BaseUrl } from "@/lib/utils"

const API_URL = BaseUrl;

// Define an interface for example dialogues
interface ExampleDialogue {
  user: string;
  character: string;
}

interface Character {
  id: string;
  showcaseId: string;
  name: string;
  description: string;
  category: string; // maps to character.role in the schema
  popularity: string;
  status: string; // "active" or "inactive" based on isActive boolean
  personality: string;
  imageUrl: string; // maps to character.avatar
  addedBy: string;
  addedById: string;
  backstory?: string;
  environment?: string;
  tags?: string[];
  additionalInfo?: string;
  goals?: string;
  quirks?: string;
  tone?: string;
  speechStyle?: string;
  exampleDialogues?: ExampleDialogue[]; 
}


interface ShowcaseItem {
  id: string;
  character: {
    id: string;
    name: string;
    description?: string;
    role?: string;
    personality?: string;
    avatar?: string;
    backstory?: string;
    environment?: string;
    tags?: string[];
    additionalInfo?: string;
    goals?: string;
    quirks?: string;
    tone?: string;
    speechStyle?: string;
    exampleDialogues?: ExampleDialogue[]; 
  };
  isActive: boolean;
  user: {
    name: string;
  };
  addedBy: string;
}

interface PublicCharacter {
  id: string;
  name: string;
  description?: string;
  role?: string;
  avatar?: string;
  personality?: string;
  createdBy?: string;
  environment?: string;
  additionalInfo?: string;
  tags?: string[];
  backstory?: string;
  goals?: string;
  quirks?: string;
  tone?: string;
  speechStyle?: string;
  exampleDialogues?: ExampleDialogue[];
  owner?: {
    id: string;
    name: string;
    username: string;
  };
}

export default function CharacterShowcasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showcaseCharacters, setShowcaseCharacters] = useState<Character[]>([])
  const [availableCharacters, setAvailableCharacters] = useState<PublicCharacter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPublic, setIsLoadingPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [publicSearchQuery, setPublicSearchQuery] = useState("")
  const [selectedPublicCharacter, setSelectedPublicCharacter] = useState<PublicCharacter | null>(null)
  
  useEffect(() => {
    const fetchShowcaseCharacters = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${API_URL}/admin/character-showcase`, {
          withCredentials: true
        })
        
        if (response.data.success) {
        
          const formattedData: Character[] = (response.data.data as ShowcaseItem[]).map((item: ShowcaseItem) => ({
            id: item.character.id,
            showcaseId: item.id,
            name: item.character.name,
            description: item.character.description || "No description provided",
            category: item.character.role || "Not categorized",
            popularity: "medium", // This could be calculated based on interactions
            status: item.isActive ? "active" : "inactive", // Convert boolean to string status
            personality: item.character.personality ?? "",
            imageUrl: item.character.avatar || "/default-avatar.png",
            addedBy: item.user.name,
            addedById: item.addedBy,
            
            backstory: item.character.backstory,
            environment: item.character.environment,
            tags: item.character.tags,
            additionalInfo: item.character.additionalInfo,
            goals: item.character.goals,
            quirks: item.character.quirks,
            tone: item.character.tone,
            speechStyle: item.character.speechStyle,
            exampleDialogues: item.character.exampleDialogues
          }))
          setShowcaseCharacters(formattedData)
        } else {
          toast.error("Failed to fetch showcase characters")
        }
      } catch (error) {
        console.error("Error fetching showcase characters:", error)
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to fetch showcase characters")
        } else {
          toast.error("Failed to fetch showcase characters")
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchShowcaseCharacters()
  }, [])
  
  const fetchPublicCharacters = async () => {
    try {
      setIsLoadingPublic(true)
      const response = await axios.get(`${API_URL}/character/public`, {
        withCredentials: true
      })
      
      if (response.data.characters) {
        setAvailableCharacters(response.data.characters)
      } else {
        toast.error("Failed to fetch public characters")
      }
    } catch (error) {
      console.error("Error fetching public characters:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch public characters")
      } else {
        toast.error("Failed to fetch public characters")
      }
    } finally {
      setIsLoadingPublic(false)
    }
  }
  
  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      fetchPublicCharacters()
    }
  }
  
  const addToShowcase = async (characterId: string) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post(`${API_URL}/admin/character-showcase`, {
        characterId
      }, {
        withCredentials: true
      })
      
      if (response.data.success) {
        toast.success("Character added to showcase successfully")
        
        const showcaseResponse = await axios.get(`${API_URL}/admin/character-showcase`, {
          withCredentials: true
        })
        
        if (showcaseResponse.data.success) {
          const formattedData = (showcaseResponse.data.data as ShowcaseItem[]).map(item => ({
            id: item.character.id,
            showcaseId: item.id,
            name: item.character.name,
            description: item.character.description || "No description provided",
            category: item.character.role || "Not categorized",
            popularity: "medium",
            status: item.isActive ? "active" : "inactive",
            personality: item.character.personality ?? "",
            imageUrl: item.character.avatar || "/default-avatar.png",
            addedBy: item.user.name,
            addedById: item.addedBy,
            backstory: item.character.backstory,
            environment: item.character.environment,
            tags: item.character.tags,
            additionalInfo: item.character.additionalInfo,
            goals: item.character.goals,
            quirks: item.character.quirks,
            tone: item.character.tone,
            speechStyle: item.character.speechStyle,
            exampleDialogues: item.character.exampleDialogues
          }))
          setShowcaseCharacters(formattedData)
        }
      } else {
        toast.error("Failed to add character to showcase")
      }
    } catch (error) {
      console.error("Error adding character to showcase:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add character to showcase")
      } else {
        toast.error("Failed to add character to showcase")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const removeFromShowcase = async (showcaseId: string) => {
    try {
      setIsSubmitting(true)
      const response = await axios.delete(`${API_URL}/admin/character-showcase`, {
        data: { characterId: showcaseId },
        withCredentials: true
      })
      
      if (response.data.success) {
        toast.success("Character removed from showcase successfully")
        
        // Update the list by removing the deleted item
        setShowcaseCharacters(prev => prev.filter(char => char.showcaseId !== showcaseId))
      } else {
        toast.error("Failed to remove character from showcase")
      }
    } catch (error) {
      console.error("Error removing character from showcase:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to remove character from showcase")
      } else {
        toast.error("Failed to remove character from showcase")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  
  const filteredCharacters = showcaseCharacters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        character.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && character.status === "active"
    if (activeTab === "draft") return matchesSearch && character.status === "inactive"
    if (activeTab === "popular") return matchesSearch && character.popularity === "high"
    
    return matchesSearch
  })
  
  const filteredPublicCharacters = availableCharacters.filter(character => {
    return character.name?.toLowerCase().includes(publicSearchQuery.toLowerCase()) ||
           character.description?.toLowerCase().includes(publicSearchQuery.toLowerCase())
  })

  const viewCharacterDetails = (character: Character) => {
    setSelectedCharacter(character)
  }

  
  const viewPublicCharacterDetails = (character: PublicCharacter) => {
    setSelectedPublicCharacter(character)
  }

  const toggleCharacterStatus = async (showcaseId: string, currentStatus: string) => {
    try {
      setIsSubmitting(true)
      const newStatus = currentStatus === "active" ? false : true
      
      const response = await axios.put(`${API_URL}/admin/character-showcase`, {
        showcaseId,
        status: newStatus
      }, {
        withCredentials: true
      })
      
      if (response.data.success) {
        toast.success(`Character ${newStatus ? 'activated' : 'deactivated'} successfully`)
        
        setShowcaseCharacters(prev => 
          prev.map(char => 
            char.showcaseId === showcaseId 
              ? {...char, status: newStatus ? "active" : "inactive"} 
              : char
          )
        )
        
        if (selectedCharacter && selectedCharacter.showcaseId === showcaseId) {
          setSelectedCharacter({
            ...selectedCharacter,
            status: newStatus ? "active" : "inactive"
          })
        }
      } else {
        toast.error("Failed to update character status")
      }
    } catch (error) {
      console.error("Error toggling character status:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update character status")
      } else {
        toast.error("Failed to update character status")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Character Showcase</h1>
          <p className="text-sm text-muted-foreground">Manage and preview AI characters available in your platform</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link href="/admin" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Back to Dashboard</Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">Add Characters to Showcase</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[900px] p-0 max-h-[90vh] flex flex-col mx-4 sm:mx-auto">
              <div className="sticky top-0 bg-background z-10 border-b">
                <DialogHeader className="px-6 py-4">
                  <DialogTitle>Add Characters to Showcase</DialogTitle>
                  <DialogDescription>
                    Select from available public characters to add to your showcase.
                  </DialogDescription>
                </DialogHeader>
                <div className="px-6 pb-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search available characters..."
                      value={publicSearchQuery}
                      onChange={(e) => setPublicSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto px-6 py-4 flex-1 pb-20" style={{ paddingBottom: "120px" }}>
                {isLoadingPublic ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading characters...</span>
                  </div>
                ) : (
                  <>
                    {filteredPublicCharacters.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No public characters found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredPublicCharacters.map((character) => {
                          // Check if character is already in showcase
                          const isInShowcase = showcaseCharacters.some(
                            (c) => c.id === character.id
                          )
                          
                          return (
                            <Card key={character.id} className="overflow-hidden flex flex-col">
                              <div className="flex p-3 pb-2 gap-3">
                                <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                  {character.avatar ? (
                                    <img 
                                      src={character.avatar} 
                                      alt={character.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                                      <span className="text-muted-foreground text-xs">No image</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm truncate">{character.name}</h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {character.description || "No description provided"}
                                  </p>
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {character.role && (
                                      <Badge 
                                        variant="outline"
                                        className="text-xs px-1.5 py-0 h-5 truncate max-w-[120px]"
                                      >
                                        {character.role}
                                      </Badge>
                                    )}
                                    {character.tags && character.tags.length > 0 && (
                                      <Badge 
                                        variant="secondary"
                                        className="text-xs px-1.5 py-0 h-5 truncate max-w-[120px]"
                                      >
                                        {character.tags[0]}
                                      </Badge>
                                    )}
                                    {character.personality && (
                                      <Badge 
                                        variant="default"
                                        className="text-xs px-1.5 py-0 h-5 truncate max-w-[120px]"
                                      >
                                        {character.personality.split(',')[0]}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <CardFooter className="p-3 pt-0 flex justify-end gap-2 mt-auto">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                  onClick={() => viewPublicCharacterDetails(character)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8"
                                  variant={isInShowcase ? "secondary" : "default"}
                                  onClick={() => {
                                    if (isInShowcase) {
                                      // Character is already in showcase
                                      toast.info("Character is already in showcase")
                                    } else {
                                      addToShowcase(character.id)
                                    }
                                  }}
                                  disabled={isSubmitting || isInShowcase}
                                >
                                  {isSubmitting ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  ) : isInShowcase ? (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                  ) : null}
                                  {isInShowcase ? "Added" : "Add"}
                                </Button>
                              </CardFooter>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-background border-t">
                <DialogFooter className="flex justify-between p-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                  <Button onClick={() => fetchPublicCharacters()} disabled={isLoadingPublic}>
                    {isLoadingPublic ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Refresh List
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 mb-6">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8"
          />
        </div>
        
        <div className="w-full sm:w-auto overflow-x-auto">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-initial">All</TabsTrigger>
              <TabsTrigger value="active" className="flex-1 sm:flex-initial">Active</TabsTrigger>
              <TabsTrigger value="draft" className="flex-1 sm:flex-initial">Drafts</TabsTrigger>
              <TabsTrigger value="popular" className="flex-1 sm:flex-initial">Popular</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading characters...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredCharacters.map((character) => (
              <Card key={character.id} className="overflow-hidden h-auto flex flex-col">
                <div className="relative h-28 sm:h-32 bg-muted">
                  {character.imageUrl ? (
                    <img 
                      src={character.imageUrl} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <Badge 
                    variant={character.status === "active" ? "default" : "secondary"}
                    className="absolute top-2 right-2"
                  >
                    {character.status}
                  </Badge>
                </div>
                
                <CardHeader className="p-2 sm:p-3 pb-1">
                  <CardTitle className="text-base truncate">{character.name}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">{character.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-2 sm:p-3 pt-0 text-xs space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Creator:</span>
                    <span className="font-medium truncate">{character.addedBy}</span>
                  </div>
                  
                  {character.tags && character.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {character.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1.5 py-0 h-5">
                          {tag}
                        </Badge>
                      ))}
                      {character.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                          +{character.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-2 sm:p-3 pt-0 mt-auto flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewCharacterDetails(character)}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFromShowcase(character.showcaseId)}
                    disabled={isSubmitting}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : "Remove"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Public Character Details Dialog */}
          {selectedPublicCharacter && (
            <Dialog 
              open={!!selectedPublicCharacter} 
              onOpenChange={(open) => !open && setSelectedPublicCharacter(null)}
            >
              <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[800px] p-0 flex flex-col max-h-[90vh] mx-4 sm:mx-auto">
                <div className="sticky top-0 bg-background z-10 border-b">
                  <DialogHeader className="px-6 py-4">
                    <DialogTitle>{selectedPublicCharacter.name}</DialogTitle>
                    <DialogDescription>
                      {selectedPublicCharacter.description || "No description provided"}
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                <div className="overflow-y-auto px-4 sm:px-6 py-4 flex-1" style={{ paddingBottom: "120px" }}>
                  <div className="grid gap-4">
                    <div className="flex justify-center">
                      {selectedPublicCharacter.avatar ? (
                        <img 
                          src={selectedPublicCharacter.avatar} 
                          alt={selectedPublicCharacter.name} 
                          className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-md" 
                        />
                      ) : (
                        <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-md bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedPublicCharacter.role && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-medium">Role</Label>
                        <span className="col-span-3">{selectedPublicCharacter.role}</span>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.personality && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Personality</Label>
                        <div className="col-span-3 bg-muted p-2 rounded-md">
                          {selectedPublicCharacter.personality}
                        </div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.backstory && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Backstory</Label>
                        <div className="col-span-3 bg-muted p-2 rounded-md">
                          {selectedPublicCharacter.backstory}
                        </div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.environment && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Environment</Label>
                        <div className="col-span-3">{selectedPublicCharacter.environment}</div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.goals && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Goals</Label>
                        <div className="col-span-3">{selectedPublicCharacter.goals}</div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.quirks && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Quirks</Label>
                        <div className="col-span-3">{selectedPublicCharacter.quirks}</div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.tone && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Tone</Label>
                        <div className="col-span-3">{selectedPublicCharacter.tone}</div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.speechStyle && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Speech Style</Label>
                        <div className="col-span-3">{selectedPublicCharacter.speechStyle}</div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.tags && selectedPublicCharacter.tags.length > 0 && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Tags</Label>
                        <div className="col-span-3 flex flex-wrap gap-1">
                          {selectedPublicCharacter.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.owner && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-medium">Created By</Label>
                        <span className="col-span-3">{selectedPublicCharacter.owner.name}</span>
                      </div>
                    )}
                    
                    {selectedPublicCharacter.exampleDialogues && 
                     Array.isArray(selectedPublicCharacter.exampleDialogues) && 
                     selectedPublicCharacter.exampleDialogues.length > 0 && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium">Example Dialogues</Label>
                        <div className="col-span-3 space-y-2">
                          {selectedPublicCharacter.exampleDialogues.map((dialogue, index) => (
                            <div key={index} className="space-y-1">
                              <p className="text-sm font-medium">User: {dialogue.user}</p>
                              <p className="text-sm bg-muted p-2 rounded-md">{dialogue.character}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-background border-t">
                  <DialogFooter className="p-4 sm:p-6">
                    <Button 
                      onClick={() => {
                        // Check if already in showcase
                        const isInShowcase = showcaseCharacters.some(
                          (c) => c.id === selectedPublicCharacter.id
                        )
                        
                        if (isInShowcase) {
                          toast.info("Character is already in showcase")
                        } else {
                          addToShowcase(selectedPublicCharacter.id)
                          setSelectedPublicCharacter(null) // Close dialog after adding
                        }
                      }}
                      disabled={isSubmitting || showcaseCharacters.some(c => c.id === selectedPublicCharacter.id)}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {showcaseCharacters.some(c => c.id === selectedPublicCharacter.id) 
                        ? "Already in Showcase" 
                        : "Add to Showcase"}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Character Details Dialog */}
          {selectedCharacter && (
            <Dialog open={!!selectedCharacter} onOpenChange={(open) => !open && setSelectedCharacter(null)}>
              <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[800px] p-0 flex flex-col max-h-[90vh] mx-4 sm:mx-auto">
                <div className="sticky top-0 bg-background z-10 border-b">
                  <DialogHeader className="px-6 py-4">
                    <DialogTitle>{selectedCharacter.name}</DialogTitle>
                    <DialogDescription>{selectedCharacter.description}</DialogDescription>
                  </DialogHeader>
                </div>
                
                <div className="overflow-y-auto px-4 sm:px-6 py-4 flex-1" style={{ paddingBottom: "80px" }}>
                  <div className="grid gap-4">
                    <div className="flex justify-center">
                      {selectedCharacter.imageUrl ? (
                        <img 
                          src={selectedCharacter.imageUrl} 
                          alt={selectedCharacter.name} 
                          className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-md" 
                        />
                      ) : (
                        <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-md bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-4">
                      <Label className="text-right font-medium col-span-1">Creator</Label>
                      <span className="col-span-2 sm:col-span-3">{selectedCharacter.addedBy}</span>
                    </div>
                    
                    {selectedCharacter.category && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-4">
                        <Label className="text-right font-medium col-span-1">Category</Label>
                        <span className="col-span-2 sm:col-span-3">{selectedCharacter.category}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-4">
                      <Label className="text-right font-medium col-span-1">Status</Label>
                      <Badge 
                        variant={selectedCharacter.status === "active" ? "default" : "secondary"} 
                        className="col-span-2 sm:col-span-3 w-fit"
                      >
                        {selectedCharacter.status}
                      </Badge>
                    </div>
                    
                    {selectedCharacter.personality && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Personality</Label>
                        <div className="col-span-2 sm:col-span-3 bg-muted p-2 rounded-md">
                          {selectedCharacter.personality}
                        </div>
                      </div>
                    )}
                    
                    {selectedCharacter.backstory && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Backstory</Label>
                        <div className="col-span-2 sm:col-span-3 bg-muted p-2 rounded-md">
                          {selectedCharacter.backstory}
                        </div>
                      </div>
                    )}
                    
                    {selectedCharacter.environment && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Environment</Label>
                        <div className="col-span-2 sm:col-span-3">{selectedCharacter.environment}</div>
                      </div>
                    )}
                    
                    {selectedCharacter.goals && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Goals</Label>
                        <div className="col-span-2 sm:col-span-3">{selectedCharacter.goals}</div>
                      </div>
                    )}
                    
                    {selectedCharacter.quirks && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Quirks</Label>
                        <div className="col-span-2 sm:col-span-3">{selectedCharacter.quirks}</div>
                      </div>
                    )}
                    
                    {selectedCharacter.tone && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Tone</Label>
                        <div className="col-span-2 sm:col-span-3">{selectedCharacter.tone}</div>
                      </div>
                    )}
                    
                    {selectedCharacter.speechStyle && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Speech Style</Label>
                        <div className="col-span-2 sm:col-span-3">{selectedCharacter.speechStyle}</div>
                      </div>
                    )}
                    
                    {selectedCharacter.additionalInfo && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Additional Info</Label>
                        <div className="col-span-2 sm:col-span-3 bg-muted p-2 rounded-md">
                          {selectedCharacter.additionalInfo}
                        </div>
                      </div>
                    )}
                    
                    {selectedCharacter.tags && selectedCharacter.tags.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Tags</Label>
                        <div className="col-span-2 sm:col-span-3 flex flex-wrap gap-1">
                          {selectedCharacter.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedCharacter.exampleDialogues && 
                     Array.isArray(selectedCharacter.exampleDialogues) && 
                     selectedCharacter.exampleDialogues.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 items-start gap-4">
                        <Label className="text-right font-medium col-span-1">Example Dialogues</Label>
                        <div className="col-span-2 sm:col-span-3 space-y-2">
                          {selectedCharacter.exampleDialogues.map((dialogue, index) => (
                            <div key={index} className="space-y-1">
                              <p className="text-sm font-medium">User: {dialogue.user}</p>
                              <p className="text-sm bg-muted p-2 rounded-md">{dialogue.character}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-background border-t">
                  <DialogFooter className="flex flex-col sm:flex-row justify-between p-4 sm:p-6 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeFromShowcase(selectedCharacter.showcaseId)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Remove from Showcase
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => toggleCharacterStatus(selectedCharacter.showcaseId, selectedCharacter.status)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {selectedCharacter.status === "active" ? "Set Inactive" : "Set Active"}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {filteredCharacters.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No characters found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
