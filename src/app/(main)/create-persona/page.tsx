"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { BaseUrl, base64ToFile } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import Image from "next/image";

// Persona validation schema
const personaSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .nonempty("Name is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .nonempty("Description is required"),
  personality: z
    .string()
    .min(10, "Personality must be at least 10 characters")
    .max(1000, "Personality cannot exceed 1000 characters")
    .nonempty("Personality is required"),
  avatar: z.string().optional(),
});

type PersonaFormData = z.infer<typeof personaSchema>;
type ValidationErrors = Partial<Record<keyof PersonaFormData, string>>;

export default function CreatePersona() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<PersonaFormData>({
    name: "",
    description: "",
    personality: "",
    avatar: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  // Avatar input options
  const [avatarInput, setAvatarInput] = useState<"url" | "file" | "generate">("file");
  const [urlAvatar, setUrlAvatar] = useState("");
  const [generatedAvatar, setGeneratedAvatar] = useState("");
  
  // Avatar generation states
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState("A portrait with detailed features, high quality");
  const [generationError, setGenerationError] = useState<string | null>(null);

  const validateField = (
    name: keyof PersonaFormData,
    value: string
  ): string | null => {
    try {
      personaSchema.shape[name].parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return "Invalid input";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field and update errors
    const fieldError = validateField(name as keyof PersonaFormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Full validation before submission
    const validationResult = personaSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: ValidationErrors = {};
      validationResult.error.errors.forEach((error) => {
        const path = error.path[0] as keyof PersonaFormData;
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a FormData object to send the data including the file
      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('personality', formData.personality);
      
      // Handle different avatar input types
      if ((avatarInput === "file" || avatarInput === "generate") && imageFile) {
        formDataToSend.append('avatar', imageFile);
      } else if (avatarInput === "url" && urlAvatar) {
        formDataToSend.append('avatarUrl', urlAvatar);
      }
      
      // Send the data to your API
      const response = await axios.post(`${BaseUrl}/persona`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      
      if (response.status !== 201) {
        throw new Error("Failed to create persona");
      }

      console.log("Persona created successfully:", response.data);
      toast.success("Persona created successfully!");
      // Redirect to the personas list
      router.push('/personas');
    } catch (error: any) {
      toast.error(`Failed to create persona: ${error.message}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file object for later submission
    setImageFile(file);
    
    // Create a URL for preview
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      avatar: imageUrl,
    }));
  };
  
  // Function to handle avatar generation
  const generateAvatar = async () => {
    if (!generationPrompt.trim()) {
      setGenerationError("Please enter a description for your persona");
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
        setFormData(prev => ({
          ...prev,
          avatar: data.result.image,
        }));
        
        // Convert base64 to File object
        const fileName = `avatar-${Date.now()}.png`;
        const avatarFile = base64ToFile(data.result.image, fileName);
        setImageFile(avatarFile);
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
      name: "Portrait",
      prompt: "A portrait with detailed features, high quality"
    },
    {
      name: "Professional",
      prompt: "A professional headshot of a person with business attire"
    },
    {
      name: "Casual",
      prompt: "A casual portrait photo of a person smiling"
    }
  ];

  // Helper component to show error messages
  const ErrorMessage = ({ message }: { message?: string }) => {
    return message ? (
      <p className="text-sm text-red-500 mt-1">{message}</p>
    ) : null;
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Persona</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Your Persona Details</CardTitle>
            <CardDescription>
              Create a persona that represents you in conversations with characters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className={errors.name ? "text-red-500" : ""}
                >
                  Persona Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter persona name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                <ErrorMessage message={errors.name} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="avatarType">Persona Avatar</Label>
                <RadioGroup 
                  id="avatarType" 
                  value={avatarInput} 
                  onValueChange={(value) => {
                    setAvatarInput(value as "url" | "file" | "generate");
                    // Update avatar based on the selected type
                    if (value === "url") {
                      setFormData(prev => ({ ...prev, avatar: urlAvatar }));
                    } else if (value === "generate") {
                      setFormData(prev => ({ ...prev, avatar: generatedAvatar }));
                    }
                    // File option keeps existing avatar value
                  }}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file" className="cursor-pointer">Upload File</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="url" />
                    <Label htmlFor="url" className="cursor-pointer">Enter URL</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="generate" id="generate" />
                    <Label htmlFor="generate" className="cursor-pointer">Generate with AI</Label>
                  </div>
                </RadioGroup>

                <div className="min-h-[200px] mt-2">
                  {avatarInput === "file" && (
                    <div className="space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {formData.avatar && avatarInput === "file" && (
                        <div className="mt-2">
                          <div className="relative w-32 h-32">
                            <img
                              src={formData.avatar}
                              alt="Persona preview"
                              className="w-32 h-32 object-cover rounded-md"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {avatarInput === "url" && (
                    <div className="space-y-2">
                      <Input
                        id="avatarUrl"
                        name="avatarUrl"
                        type="text"
                        value={urlAvatar}
                        onChange={(e) => {
                          setUrlAvatar(e.target.value);
                          setFormData(prev => ({ ...prev, avatar: e.target.value }));
                        }}
                        placeholder="https://example.com/avatar.png"
                      />
                      
                      {urlAvatar && (
                        <div className="mt-2">
                          <div className="relative w-32 h-32">
                            <Image
                              src={urlAvatar}
                              alt="Persona avatar"
                              className="rounded-md object-cover border"
                              width={128}
                              height={128}
                              unoptimized
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {avatarInput === "generate" && (
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
                        placeholder="Describe your persona's appearance"
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
                      
                      {generatedAvatar && avatarInput === "generate" && (
                        <div className="mt-2">
                          <div className="relative w-32 h-32">
                            <Image
                              src={generatedAvatar}
                              alt="Generated persona avatar"
                              className="rounded-md object-cover border"
                              width={128}
                              height={128}
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className={errors.description ? "text-red-500" : ""}
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your persona's appearance, background, etc."
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "border-red-500" : ""}
                rows={4}
              />
              <ErrorMessage message={errors.description} />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="personality"
                className={errors.personality ? "text-red-500" : ""}
              >
                Personality
              </Label>
              <Textarea
                id="personality"
                name="personality"
                placeholder="Describe your persona's personality, behaviors, and mannerisms"
                value={formData.personality}
                onChange={handleChange}
                className={errors.personality ? "border-red-500" : ""}
                rows={3}
              />
              <ErrorMessage message={errors.personality} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Persona"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
