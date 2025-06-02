"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Loader2 } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

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
}

export default function CreateCharacterPage() {
  const router = useRouter();
//   const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Avatar generation state
  const [avatarInput, setAvatarInput] = useState<"url" | "generate">("url");
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState("A portrait of a character with detailed features, high quality");
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Separate avatar states
  const [urlAvatar, setUrlAvatar] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState("");
  
  // Form state
  const [character, setCharacter] = useState<CharacterFormData>({
    name: "",
    personality: "",
    description: "",
    avatar: "",
    // Advanced fields
    environment: "",
    additionalInfo: "",
    tags: "",
    backstory: "",
    role: "",
    goals: "",
    quirks: "",
    tone: "",
    speechStyle: "",
    exampleDialogues: "[]"
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "avatar") {
      setUrlAvatar(value);
      setCharacter(prev => ({ ...prev, [name]: value }));
    } else {
      setCharacter(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for API - use the appropriate avatar based on input type
      const avatarToUse = avatarInput === "url" ? urlAvatar : generatedAvatar;
      
      const formData = {
        ...character,
        avatar: avatarToUse,
        tags: character.tags ? character.tags.split(",").map(tag => tag.trim()) : [],
        exampleDialogues: character.exampleDialogues ? JSON.parse(character.exampleDialogues) : null
      };

      // Call your API endpoint
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create character");
      }

      // Redirect to characters page
      router.push("/characters");
    } catch (error) {
      console.error("Error creating character:", error instanceof Error ? error.message : String(error));
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
      
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: generationPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.result) {
        // Update the generated avatar state
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

  // Component for avatar input (used in both basic and advanced tabs)
  const AvatarInput = () => (
    <div className="space-y-3">
      <Label htmlFor="avatarType">Avatar</Label>
      <RadioGroup 
        id="avatarType" 
        value={avatarInput} 
        onValueChange={(value) => {
          setAvatarInput(value as "url" | "generate");
          // Update character.avatar based on the selected type
          const newAvatarValue = value === "url" ? urlAvatar : generatedAvatar;
          setCharacter(prev => ({ ...prev, avatar: newAvatarValue }));
        }}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="url" id="url" />
          <Label htmlFor="url" className="cursor-pointer">Enter URL</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="generate" id="generate" />
          <Label htmlFor="generate" className="cursor-pointer">Generate with AI</Label>
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
        ) : (
          <div className="space-y-3 p-3 border rounded-md">
            <div className="flex flex-wrap gap-2 mb-2">
              {avatarTemplates.map((template, idx) => (
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
              onChange={(e) => setGenerationPrompt(e.target.value)}
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
  );

  return (
    <div className="h-full w-full flex justify-center py-10 overflow-y-auto px-2">
      <Card className="border-none shadow-md w-full max-w-4xl min-h-fit">
        <CardHeader>
          <CardTitle className="text-3xl">Create a New Character</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "advanced")}>
              <div className="flex justify-end mb-6">
                <TabsList>
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
                  </div>

                  <div className="space-y-4">
                    <AvatarInput />
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
                      </div>

                      <div className="space-y-4">
                        <AvatarInput />
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
                            Enter a valid JSON array of objects with "user" and "ai" keys
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
                {isSubmitting ? "Creating..." : "Create Character"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
