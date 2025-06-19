"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useRouter } from '@bprogress/next/app';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {  base64ToFile } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axiosInstance";
import BackgroundDesign from "@/components/background-design";

interface CharacterFormData {
  name: string;
  personality: string;
  description: string;
  avatar: string;
  environment: string;
  additionalInfo: string;
  tags: string;
  backstory: string;
  role: string;
  goals: string;
  quirks: string;
  tone: string;
  speechStyle: string;
  exampleDialogues: string;
  isPublic: boolean;
}

type AvatarTemplate = {
  name: string;
  prompt: string;
};

interface AvatarInputProps {
  avatarInput: "url" | "generate" | "file";
  setAvatarInput: (input: "url" | "generate" | "file") => void;
  urlAvatar: string;
  setUrlAvatar: React.Dispatch<React.SetStateAction<string>>;
  generatedAvatar: string;
  setGeneratedAvatar: React.Dispatch<React.SetStateAction<string>>;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  generationPrompt: string;
  setGenerationPrompt: (prompt: string) => void;
  isGeneratingAvatar: boolean;
  generateAvatar: () => Promise<void>;
  generationError: string | null;
  avatarTemplates: AvatarTemplate[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCharacter: React.Dispatch<React.SetStateAction<CharacterFormData>>;
}

const AvatarInput = React.memo(({
  avatarInput, setAvatarInput,
  urlAvatar,
  generatedAvatar,
  imageFile, setImageFile,
  generationPrompt, setGenerationPrompt,
  isGeneratingAvatar, generateAvatar,
  generationError, avatarTemplates, handleChange,
  setCharacter
}: AvatarInputProps) => (
  <div className="space-y-3">
    <Label htmlFor="avatarType">Avatar</Label>
    <RadioGroup 
      id="avatarType" 
      value={avatarInput} 
      onValueChange={(value) => {
        setAvatarInput(value as "url" | "generate" | "file");
        if (value === "url") {
          setCharacter((prev: CharacterFormData) => ({ ...prev, avatar: urlAvatar }));
          setImageFile(null);
        } else if (value === "generate") {
          setCharacter((prev: CharacterFormData) => ({ ...prev, avatar: generatedAvatar }));
          setImageFile(null);
        }
      }}
      className="flex space-x-4 flex-wrap"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="url" id="url" />
        <Label htmlFor="url" className="cursor-pointer">Enter URL</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="generate" id="generate" />
        <Label htmlFor="generate" className="cursor-pointer">Generate with AI</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="file" id="file" />
        <Label htmlFor="file" className="cursor-pointer">Upload File</Label>
      </div>
    </RadioGroup>

    <div className="min-h-[250px]">
      {avatarInput === "url" ? (
        <div className="space-y-2">
          <Input
            id="avatar"
            name="avatar"
            type="text"
            value={urlAvatar}
            onChange={handleChange}
            placeholder="https://example.com/avatar.png"
          />
          
          {/* Show image preview if URL exists */}
          {urlAvatar && (
            <div className="mt-4">
              <div className="relative w-full aspect-square max-w-[150px] mx-auto">
                <Image
                  src={urlAvatar}
                  alt="Character avatar"
                  className="rounded-md object-cover border"
                  fill
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ) : avatarInput === "file" ? (
        <div className="space-y-2">
          <Input
            id="avatarFile"
            name="avatarFile"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {imageFile && (
            <div className="mt-4">
              <div className="relative w-full aspect-square max-w-[150px] mx-auto">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Character avatar"
                  className="rounded-md object-cover border"
                  fill
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 p-3 border rounded-md">
          <div className="flex flex-wrap gap-2 mb-2">
            {avatarTemplates.map((template: AvatarTemplate, idx: number) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setGenerationPrompt(template.prompt)}
                className="text-xs"
              >
                {template.name}
              </Button>
            ))}
          </div>
          
          <Textarea
            value={generationPrompt}
            onChange={(e) => {
              const target = e.target;
              const selectionStart = target.selectionStart;
              const selectionEnd = target.selectionEnd;
              
              setGenerationPrompt(e.target.value);
              
              // Use setTimeout to restore cursor position after state update and re-render
              setTimeout(() => {
                if (document.activeElement === target) {
                  target.selectionStart = selectionStart;
                  target.selectionEnd = selectionEnd;
                }
              }, 0);
            }}
            placeholder="Describe your character's appearance"
            className="resize-none text-sm"
            rows={2}
          />
          
          <Button
            type="button"
            onClick={generateAvatar}
            disabled={isGeneratingAvatar}
            className="w-full"
            size="sm"
          >
            {isGeneratingAvatar ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Avatar"
            )}
          </Button>
          
          {generationError && (
            <p className="text-xs text-red-500">{generationError}</p>
          )}
          
          {generatedAvatar && (
            <div className="mt-2">
              <div className="relative w-full aspect-square max-w-[150px] mx-auto">
                <Image
                  src={generatedAvatar}
                  alt="Character avatar"
                  className="rounded-md object-cover border"
                  fill
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
));
AvatarInput.displayName = 'AvatarInput';
export default function EditCharacterPage() {
  const router = useRouter();
  const params = useParams();
  const characterId = params.characterId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [avatarInput, setAvatarInput] = useState<"url" | "generate" | "file">("url");
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState("A portrait of a character with detailed features, high quality");
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [urlAvatar, setUrlAvatar] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [character, setCharacter] = useState<CharacterFormData>({
    name: "",
    personality: "",
    description: "",
    avatar: "",
    environment: "",
    additionalInfo: "",
    tags: "",
    backstory: "",
    role: "",
    goals: "",
    quirks: "",
    tone: "",
    speechStyle: "",
    exampleDialogues: "[]",
    isPublic: false 
  });

  // Fetch character data
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/character/${characterId}`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          const characterData = response.data.character;
          
          // Convert tags array to comma-separated string
          const tagsString = Array.isArray(characterData.tags) 
            ? characterData.tags.join(", ") 
            : "";
            
          // Convert exampleDialogues to string if it exists
          let exampleDialoguesString = "[]";
          if (characterData.exampleDialogues) {
            try {
              if (typeof characterData.exampleDialogues === 'string') {
                // If it's already a string, validate it's valid JSON
                JSON.parse(characterData.exampleDialogues);
                exampleDialoguesString = characterData.exampleDialogues;
              } else {
                // If it's an object, stringify it
                exampleDialoguesString = JSON.stringify(characterData.exampleDialogues);
              }
            } catch (error) {
              console.error("Error processing exampleDialogues:", error);
              exampleDialoguesString = "[]";
            }
          }
          
          setCharacter({
            name: characterData.name || "",
            personality: characterData.personality || "",
            description: characterData.description || "",
            avatar: characterData.avatar || "",
            environment: characterData.environment || "",
            additionalInfo: characterData.additionalInfo || "",
            tags: tagsString,
            backstory: characterData.backstory || "",
            role: characterData.role || "",
            goals: characterData.goals || "",
            quirks: characterData.quirks || "",
            tone: characterData.tone || "",
            speechStyle: characterData.speechStyle || "",
            exampleDialogues: exampleDialoguesString,
            isPublic: !!characterData.isPublic
          });
          
          // Set avatar values
          if (characterData.avatar) {
            setUrlAvatar(characterData.avatar);
            setAvatarInput("url");
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "file" && name === "avatarFile") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImageFile(file);
        setUrlAvatar(""); 
        setCharacter(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
      }
    } else if (name === "avatar") {
      setUrlAvatar(value);
      setImageFile(null); 
      setCharacter(prev => ({ ...prev, [name]: value }));
    } else if (name === "isPublic") {
      setCharacter(prev => ({ ...prev, isPublic: (e.target as HTMLInputElement).checked }));
    } else {
      setCharacter(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", character.name);
      formDataToSend.append("personality", character.personality);
      formDataToSend.append("description", character.description);
      formDataToSend.append("environment", character.environment || "");
      formDataToSend.append("additionalInfo", character.additionalInfo || "");
      formDataToSend.append("backstory", character.backstory || "");
      formDataToSend.append("role", character.role || "");
      formDataToSend.append("goals", character.goals || "");
      formDataToSend.append("quirks", character.quirks || "");
      formDataToSend.append("tone", character.tone || "");
      formDataToSend.append("speechStyle", character.speechStyle || "");
      formDataToSend.append("tags", character.tags || "");
      formDataToSend.append("isPublic", character.isPublic ? "true" : "false");
      
      // Only append exampleDialogues if present and valid
      if (character.exampleDialogues && character.exampleDialogues.trim() !== "") {
        let exampleDialoguesValue = character.exampleDialogues;
        try {
          const parsed = JSON.parse(character.exampleDialogues);
          if (Array.isArray(parsed)) {
            exampleDialoguesValue = JSON.stringify(parsed);
          } else {
            exampleDialoguesValue = "[]";
          }
        } catch {
          exampleDialoguesValue = "[]";
        }
        formDataToSend.append("exampleDialogues", exampleDialoguesValue);
      }

      if (avatarInput === "url" && urlAvatar) {
        formDataToSend.append("avatar", urlAvatar);
      } else if ((avatarInput === "generate" && generatedAvatar) || imageFile) {
        // If generatedAvatar is a base64 string, convert to File
        if (generatedAvatar && !imageFile) {
          const fileName = `avatar-${Date.now()}.png`;
          const avatarFile = base64ToFile(generatedAvatar, fileName);
          formDataToSend.append("avatar", avatarFile);
        } else if (imageFile) {
          formDataToSend.append("avatar", imageFile);
        }
      }

      const response = await api.put(
        `/character/${characterId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Character updated successfully");
        router.push(`/characters/${characterId}`);
      } else {
        throw new Error("Failed to update character");
      }
    } catch (error) {
      console.error("Error updating character:", error);
      toast.error("Failed to update character");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle avatar generation
  const generateAvatar = async () => {
    if (!generationPrompt.trim()) {
      setGenerationError("Please enter a description for your character");
      return;
    }

    try {
      setIsGeneratingAvatar(true);
      setGenerationError(null);
      
      const response = await api.post("/avatar/generate", {
        prompt: generationPrompt,  
      });

      if (response.status!=201) {
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }

      const data = await response.data;
      if (data.success && data.result) {
        setGeneratedAvatar(data.result.image);
        setCharacter(prev => ({
          ...prev,
          avatar: data.result.image,
        }));
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Quick templates for avatar generation
  const avatarTemplates = [
    {
      name: "Fantasy",
      prompt: "A portrait of a fantasy character with detailed features, high quality"
    },
    {
      name: "Sci-Fi",
      prompt: "A futuristic character portrait with sci-fi elements, detailed face"
    },
    {
      name: "Anime",
      prompt: "An anime-style character portrait with expressive features"
    }
  ];

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading character data...</span>
      </div>
    );
  }

  return (
    <>
    <BackgroundDesign />
    <div className="h-full w-full flex justify-center py-10 overflow-y-auto px-2">
      <Card className="border-none shadow-md w-full max-w-4xl min-h-fit bg-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl">Edit Character</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={character.name}
                        onChange={handleChange}
                        placeholder="Character name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personality">
                        Personality <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="personality"
                        name="personality"
                        required
                        value={character.personality}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Describe your character's personality"
                        className="resize-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        required
                        value={character.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="General description of your character"
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        name="tags"
                        value={character.tags}
                        onChange={handleChange}
                        placeholder="fantasy, sci-fi, historical, etc."
                      />
                    </div>

                    {/* isPublic toggle */}
                    <div className="flex items-center space-x-3 pt-2">
                      <Switch
                        id="isPublic"
                        name="isPublic"
                        checked={character.isPublic}
                        onCheckedChange={(checked) =>
                          setCharacter((prev) => ({ ...prev, isPublic: checked }))
                        }
                      />
                      <Label htmlFor="isPublic" className="mb-0">
                        Make Character Public
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">
                      Note: Public characters require admin approval before being visible to other users.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <AvatarInput
                      avatarInput={avatarInput}
                      setAvatarInput={setAvatarInput}
                      urlAvatar={urlAvatar}
                      setUrlAvatar={setUrlAvatar}
                      generatedAvatar={generatedAvatar}
                      setGeneratedAvatar={setGeneratedAvatar}
                      imageFile={imageFile}
                      setImageFile={setImageFile}
                      generationPrompt={generationPrompt}
                      setGenerationPrompt={setGenerationPrompt}
                      isGeneratingAvatar={isGeneratingAvatar}
                      generateAvatar={generateAvatar}
                      generationError={generationError}
                      avatarTemplates={avatarTemplates}
                      handleChange={handleChange}
                      setCharacter={setCharacter}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <div className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="pb-4">
                    <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="advanced-name">
                            Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="advanced-name"
                            name="name"
                            required
                            value={character.name}
                            onChange={handleChange}
                            placeholder="Character name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="advanced-personality">
                            Personality <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="advanced-personality"
                            name="personality"
                            required
                            value={character.personality}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe your character's personality"
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="advanced-description">
                            Description <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="advanced-description"
                            name="description"
                            required
                            value={character.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="General description of your character"
                            className="resize-none"
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                          <Switch
                            id="advanced-isPublic"
                            name="isPublic"
                            checked={character.isPublic}
                            onCheckedChange={(checked) =>
                              setCharacter((prev) => ({ ...prev, isPublic: checked }))
                            }
                          />
                          <Label htmlFor="advanced-isPublic" className="mb-0">
                            Make Character Public
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">
                          Note: Public characters require admin approval before being visible to other users.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <AvatarInput
                          avatarInput={avatarInput}
                          setAvatarInput={setAvatarInput}
                          urlAvatar={urlAvatar}
                          setUrlAvatar={setUrlAvatar}
                          generatedAvatar={generatedAvatar}
                          setGeneratedAvatar={setGeneratedAvatar}
                          imageFile={imageFile}
                          setImageFile={setImageFile}
                          generationPrompt={generationPrompt}
                          setGenerationPrompt={setGenerationPrompt}
                          isGeneratingAvatar={isGeneratingAvatar}
                          generateAvatar={generateAvatar}
                          generationError={generationError}
                          avatarTemplates={avatarTemplates}
                          handleChange={handleChange}
                          setCharacter={setCharacter}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Character Context Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-4">Character Context</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="environment">Environment</Label>
                          <Input
                            id="environment"
                            name="environment"
                            value={character.environment}
                            onChange={handleChange}
                            placeholder="Character's environment or setting"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Input
                            id="role"
                            name="role"
                            value={character.role}
                            onChange={handleChange}
                            placeholder="E.g., Cyberpunk Hacker, Fantasy Mage"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            name="tags"
                            value={character.tags}
                            onChange={handleChange}
                            placeholder="fantasy, sci-fi, historical, etc."
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="backstory">Backstory</Label>
                          <Textarea
                            id="backstory"
                            name="backstory"
                            value={character.backstory}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Character's history and background"
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="goals">Goals</Label>
                          <Textarea
                            id="goals"
                            name="goals"
                            value={character.goals}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Character's motivations and objectives"
                            className="resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Speech & Behavior Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-4">Speech & Behavior</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="quirks">Quirks</Label>
                          <Input
                            id="quirks"
                            name="quirks"
                            value={character.quirks}
                            onChange={handleChange}
                            placeholder="E.g., hates water, says 'yo' often"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tone">Tone</Label>
                          <Input
                            id="tone"
                            name="tone"
                            value={character.tone}
                            onChange={handleChange}
                            placeholder="Friendly, formal, sarcastic, etc."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="speechStyle">Speech Style</Label>
                          <Input
                            id="speechStyle"
                            name="speechStyle"
                            value={character.speechStyle}
                            onChange={handleChange}
                            placeholder="E.g., speaks in riddles, like Shakespeare"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="additionalInfo">Additional Info</Label>
                          <Textarea
                            id="additionalInfo"
                            name="additionalInfo"
                            value={character.additionalInfo}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Additional character information"
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="exampleDialogues">Example Dialogues (JSON format)</Label>
                          <Textarea
                            id="exampleDialogues"
                            name="exampleDialogues"
                            value={character.exampleDialogues}
                            onChange={handleChange}
                            rows={4}
                            className="font-mono text-sm resize-none"
                            placeholder='[{"user": "Hello", "ai": "Hi there!"}, {"user": "How are you?", "ai": "I am doing well, thank you."}]'
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter a valid JSON array of objects with &quot;user&quot; and &quot;ai&quot; keys
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-end gap-4 px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Character"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
