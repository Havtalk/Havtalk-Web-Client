"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateCharacter() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    personality: "",
    traits: "",
    imageUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your API
      console.log("Character data:", formData);
      
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Character created successfully!");
      // Redirect to characters list or the new character page
      // router.push("/characters");
    } catch (error) {
      toast.error("Failed to create character.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Here you would typically handle file upload
    // For now, create a temporary URL
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageUrl,
    }));
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Character</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Character Details</CardTitle>
            <CardDescription>
              Fill out the information below to create your roleplaying character.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Character Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter character name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Character Image</Label>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Character preview" 
                      className="w-32 h-32 object-cover rounded-md" 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your character's appearance, background, etc."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Personality</Label>
              <Textarea
                id="personality"
                name="personality"
                placeholder="Describe your character's personality, behaviors, and mannerisms"
                value={formData.personality}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="traits">Key Traits</Label>
              <Textarea
                id="traits"
                name="traits"
                placeholder="List key traits or abilities (one per line)"
                value={formData.traits}
                onChange={handleChange}
                rows={3}
              />
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
              {isSubmitting ? "Creating..." : "Create Character"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
