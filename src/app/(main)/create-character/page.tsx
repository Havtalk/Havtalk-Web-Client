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
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { BaseUrl } from "@/lib/utils";

// Character validation schema
const characterSchema = z.object({
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
  environment: z.string().optional(),
  additionalInfo: z.string().optional(),
  isPublic: z.boolean(),
  avatar: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterSchema>;
type ValidationErrors = Partial<Record<keyof CharacterFormData, string>>;

export default function CreateCharacter() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CharacterFormData>({
    name: "",
    description: "",
    personality: "",
    environment: "",
    additionalInfo: "",
    isPublic: false,
    avatar: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validateField = (
    name: keyof CharacterFormData,
    value: string | boolean
  ): string | null => {
    try {
      characterSchema.shape[name].parse(value);
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
    const fieldError = validateField(name as keyof CharacterFormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPublic: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Full validation before submission
    const validationResult = characterSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: ValidationErrors = {};
      validationResult.error.errors.forEach((error) => {
        const path = error.path[0] as keyof CharacterFormData;
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
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("personality", formData.personality);

      if (formData.environment) {
        formDataToSend.append("environment", formData.environment);
      }

      if (formData.additionalInfo) {
        formDataToSend.append("additionalInfo", formData.additionalInfo);
      }

      formDataToSend.append("isPublic", formData.isPublic.toString());

      // Add the image file if it exists
      if (imageFile) {
        formDataToSend.append("avatar", imageFile);
      }

      const response =await axios.post(`${BaseUrl}/character`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (response.status !== 201) {
        throw new Error("Failed to create character");
      }
      const result = response.data;
      console.log("Character created:", result);
      // console.log("Character created:", formDataToSend.get("avatar"));
      toast.success("Character created successfully!");
      alert("Character created successfully!");
      // Redirect to the character page
      // router.push(`/character/${result.id}`);
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

    // Store the file object for later submission
    setImageFile(file);

    // Create a URL for preview
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      avatar: imageUrl,
    }));
  };

  // Helper component to show error messages
  const ErrorMessage = ({ message }: { message?: string }) => {
    return message ? (
      <p className="text-sm text-red-500 mt-1">{message}</p>
    ) : null;
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
                <Label
                  htmlFor="name"
                  className={errors.name ? "text-red-500" : ""}
                >
                  Character Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter character name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                  // required
                />
                <ErrorMessage message={errors.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Character Avatar</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.avatar && (
                  <div className="mt-2">
                    <img
                      src={formData.avatar}
                      alt="Character preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
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
                placeholder="Describe your character's appearance, background, etc."
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "border-red-500" : ""}
                rows={4}
                // required
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
                placeholder="Describe your character's personality, behaviors, and mannerisms"
                value={formData.personality}
                onChange={handleChange}
                className={errors.personality ? "border-red-500" : ""}
                rows={3}
                // required
              />
              <ErrorMessage message={errors.personality} />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="environment"
                className={errors.environment ? "text-red-500" : ""}
              >
                Environment
              </Label>
              <Textarea
                id="environment"
                name="environment"
                placeholder="Describe the environment your character lives in or prefers"
                value={formData.environment}
                onChange={handleChange}
                className={errors.environment ? "border-red-500" : ""}
                rows={3}
              />
              <ErrorMessage message={errors.environment} />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="additionalInfo"
                className={errors.additionalInfo ? "text-red-500" : ""}
              >
                Additional Information
              </Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Any other details about your character"
                value={formData.additionalInfo}
                onChange={handleChange}
                className={errors.additionalInfo ? "border-red-500" : ""}
                rows={3}
              />
              <ErrorMessage message={errors.additionalInfo} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isPublic">Make this character public</Label>
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
