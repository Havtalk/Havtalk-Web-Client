"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("A portrait of a young female elf with long silver hair, piercing blue eyes, wearing ornate purple mage robes with gold embroidery. The character has a mysterious smile and a glowing arcane rune on her forehead. Fantasy art style, detailed face.");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const characterTemplates = [
    {
      name: "Fantasy Mage",
      prompt: "A portrait of a young female elf with long silver hair, piercing blue eyes, wearing ornate purple mage robes with gold embroidery. The character has a mysterious smile and a glowing arcane rune on her forehead. Fantasy art style, detailed face."
    },
    {
      name: "Warrior Knight",
      prompt: "A portrait of a strong male human knight with short brown hair and a beard, intense green eyes, wearing silver plate armor with a red cape. The character has a battle scar across his cheek and appears determined. Medieval fantasy art style, high quality."
    },
    {
      name: "Steampunk Engineer",
      prompt: "A portrait of a middle-aged female inventor with auburn hair in a messy bun, amber goggles on forehead, wearing a brown leather coat with brass gears and pouches. The character has oil smudges on her face and appears focused. Steampunk setting with mechanical devices in background, detailed portrait."
    },
    {
      name: "Sci-Fi Pilot",
      prompt: "A portrait of a young male pilot with short blue hair, cybernetic purple eyes, wearing a sleek white and blue flight suit with holographic interfaces. The character has neural implants visible at the temples and appears confident. Futuristic spacecraft cockpit background, high-tech sci-fi style."
    }
  ];

  const applyTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      
      // Call our own API route instead of Cloudflare directly
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.result) {
        setGeneratedImage(data.result.image);
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Character Creator</h1>
      
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-center text-purple-800">Create Your Character</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-purple-700 mb-2">Quick Templates</h3>
              <div className="flex flex-wrap gap-2">
                {characterTemplates.map((template, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    className="text-xs bg-white hover:bg-purple-100 border-purple-200"
                    onClick={() => applyTemplate(template.prompt)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium text-purple-700">
                Describe Your Character
              </label>
              <textarea
                id="prompt"
                placeholder="A portrait of a [gender] [race/species] with [hair description], [eye description], wearing [clothing description]. The character has [distinctive features] and appears [emotion/expression]. [background/setting details]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full min-h-[120px] p-3 border border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
            
            <div className="bg-purple-50 p-3 rounded-md space-y-2">
              <h3 className="text-sm font-semibold text-purple-800">Character Creation Tips:</h3>
              <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
                <li>Be specific about physical attributes (gender, age, hair, eyes, skin)</li>
                <li>Describe clothing style and notable accessories</li>
                <li>Include distinctive features (scars, tattoos, magical auras)</li>
                <li>Specify the character's expression or emotion</li>
                <li>Add portrait-style keywords like "detailed face", "high quality", "fantasy art style"</li>
              </ul>
            </div>
            
            <Button 
              onClick={generateImage} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Character Image"
              )}
            </Button>
            
            {error && (
              <div className="p-3 text-red-500 bg-red-50 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </CardContent>
        
        {generatedImage && (
          <CardFooter className="flex justify-center">
            <div className="relative w-full aspect-square max-w-md">
              <Image
                src={generatedImage}
                alt="Generated image"
                className="rounded-md object-cover"
                fill
              />
            </div>
          </CardFooter>
        )}
      </Card>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Note: You can customize the prompt for more personalized character images</p>
      </div>
    </div>
  );
}
