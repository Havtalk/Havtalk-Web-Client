'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react'
import { PencilIcon, MailIcon, UserIcon, KeyIcon, AsteriskIcon, LockIcon, EyeIcon, EyeOffIcon, BrainIcon, UploadIcon, Loader2Icon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { BaseUrl } from '@/lib/utils';
import { changePassword } from '@/lib/auth';
import api from '@/lib/axiosInstance';


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
      image?: string;
      username?: string;
    };
    userPersona?: {
      id: string;
      name: string;
      avatar?: string;
    } | null;
  };
}

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [personality, setPersonality] = useState("");
  const [isEditingPersonality, setIsEditingPersonality] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('/image (50).png');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<UserDetailsResponse>(
          `${BaseUrl}/user/user-details`,
          { withCredentials: true } // This ensures cookies are sent with the request
        );
        
        if (response.data.success) {
          const userData = response.data.data;
          
          // Set user data
          if (userData.user) {
            setEmail(userData.user.email || "");
            setName(userData.user.name || "");
            setUsername(userData.user.username || "");
            
            // Set avatar if available
            if (userData.user.image) {
              setAvatarSrc(userData.user.image);
            }
          }
          
          // Set profile details from UserDetails
          setBio(userData.bio || "");
          setPersonality(userData.personality || "");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateBio = async () => {
    try {
      setIsUpdating(true);
      const response = await api.put(
        `/user/user-details`,
        { bio }, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setIsEditingBio(false);
        toast.success("Biography updated successfully");
      }
    } catch (error) {
      console.error("Error updating bio:", error);
      toast.error("Failed to update biography. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePersonality = async () => {
    try {
      setIsUpdating(true);
      const response = await api.put(
        `/user/user-details`,
        { personality }, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setIsEditingPersonality(false);
        toast.success("Personality updated successfully");
      }
    } catch (error) {
      console.error("Error updating personality:", error);
      toast.error("Failed to update personality. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingAvatar(true);
      // Create a local URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setAvatarSrc(imageUrl);
      
      try {
        // Upload image to server
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await api.put(
          `/user/update-avatar`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, 
          }
        );
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to upload avatar");
        }
        
        toast.success("Profile picture updated successfully");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Failed to upload profile picture. Please try again.");
        // Revert to previous avatar on error
        setAvatarSrc('/image (50).png');
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Reset error state
    setPasswordError("");
    
    // Validate password fields
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      // Call the changePassword function from auth lib
      await changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      
      // Reset form and close dialog on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangePasswordOpen(false);
      
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
      toast.error(passwordError || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  return (
    <section className="relative overflow-hidden py-8 h-auto min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      {/* Background elements */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {/* Main vibrant purple/pink orb */}
        <div className="absolute top-0 left-1/4 w-[45rem] h-[45rem] rounded-full blur-3xl opacity-50 animate-pulse-slow"
             style={{background: "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(192, 38, 211, 0.4) 40%, transparent 80%)", 
                    boxShadow: "0 0 120px 60px rgba(236, 72, 153, 0.1)"}}></div>
        
        {/* Bright blue/cyan floating orb */}
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-45 animate-float"
             style={{background: "radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(59, 130, 246, 0.35) 45%, transparent 85%)",
                    boxShadow: "0 0 100px 50px rgba(6, 182, 212, 0.08)"}}></div>
        
        {/* Vivid golden/orange corner accent */}
        <div className="absolute -top-28 -right-28 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-0"
             style={{background: "conic-gradient(from 0deg, rgba(251, 191, 36, 0.45), rgba(249, 115, 22, 0.35), rgba(244, 63, 94, 0.4), rgba(251, 191, 36, 0.45))",
                    boxShadow: "0 0 80px 40px rgba(251, 191, 36, 0.08)"}}></div>
        
        {/* Rich violet/magenta accent - replaced teal/emerald */}
        <div className="absolute -bottom-40 -left-20 w-[50rem] h-[50rem] rounded-full blur-3xl opacity-40 animate-float-delayed"
             style={{background: "radial-gradient(circle, rgba(167, 139, 250, 0.55) 0%, rgba(139, 92, 246, 0.35) 40%, transparent 80%)",
                    boxShadow: "0 0 100px 50px rgba(167, 139, 250, 0.08)"}}></div>
        
        {/* Bright amber/orange mid element */}
        <div className="absolute top-1/3 right-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30 animate-pulse"
             style={{background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 80%)",
                    boxShadow: "0 0 60px 30px rgba(251, 191, 36, 0.06)"}}></div>
        
        {/* Electric indigo accent */}
        <div className="absolute bottom-1/3 left-1/4 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-50 animate-float-slow"
             style={{background: "radial-gradient(circle, rgba(129, 140, 248, 0.45) 0%, rgba(99, 102, 241, 0.3) 50%, transparent 85%)",
                    boxShadow: "0 0 70px 35px rgba(129, 140, 248, 0.07)"}}></div>
        
        {/* Vivid rose/red small accent */}
        <div className="absolute top-2/3 right-1/5 w-[18rem] h-[18rem] rounded-full blur-3xl opacity-45 animate-pulse-soft"
             style={{background: "radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(225, 29, 72, 0.3) 50%, transparent 80%)",
                    boxShadow: "0 0 50px 25px rgba(244, 63, 94, 0.08)"}}></div>
        
        {/* Deep purple accent */}
        <div className="absolute top-1/5 right-2/3 w-[22rem] h-[22rem] rounded-full blur-3xl opacity-40 animate-float"
             style={{background: "radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(124, 58, 237, 0.25) 50%, transparent 85%)",
                    boxShadow: "0 0 60px 30px rgba(139, 92, 246, 0.07)"}}></div>
        
        {/* Enhanced light streaks */}
        <div className="absolute top-1/2 left-0 w-[40rem] h-[3rem] rotate-[20deg] blur-2xl opacity-25"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)"}}></div>
        
        <div className="absolute bottom-1/3 right-0 w-[35rem] h-[2.5rem] -rotate-[15deg] blur-2xl opacity-25"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 50%, transparent 100%)"}}></div>
             
        {/* Subtle cross-light */}
        <div className="absolute top-2/3 left-1/2 w-full h-[1.5rem] -rotate-[75deg] blur-2xl opacity-20"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)"}}></div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2Icon className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      ) : (
        <Card className="w-full max-w-xl shadow-xl border border-primary/10 backdrop-blur-md">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
            </div>
          </CardHeader>
          
          <div className="flex flex-col md:flex-row items-center gap-8 mx-8 mb-6 bg-slate-800/50 p-6 rounded-xl">
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <Image
                src={avatarSrc}
                alt="User Avatar"
                className={`w-36 h-36 rounded-full border-4 ${isUploadingAvatar ? 'border-yellow-500/70 animate-pulse' : 'border-primary/20'} shadow-lg transition-all duration-300 group-hover:border-primary`}
                width={144}
                height={144}
                onClick={handleAvatarClick}
              />
              <div 
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                onClick={handleAvatarClick}
              >
                <UploadIcon className="text-white h-6 w-6" />
                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-2xl font-bold mb-2 text-white">{name || "User"}</h1>
              <p className="text-primary/80 mb-4 font-medium">@{username || "username"}</p>
              <Button 
                variant="outline" 
                className="hover:cursor-pointer bg-transparent hover:bg-primary/10 text-primary border border-primary/30 transition-all duration-300 shadow-sm"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                <KeyIcon className="mr-2 h-4 w-4" /> Change Password
              </Button>
            </div>
          </div>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                  <MailIcon className="h-4 w-4 text-primary/80" /> 
                  Email Address 
                  <AsteriskIcon className="h-3 w-3 text-destructive ml-1" />
                </Label>
              </div>
              
              <div className="space-y-3">
                <Input
                  type="email"
                  id="email"
                  value={email}
                  className="bg-slate-800/50 border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent cursor-not-allowed opacity-80"
                  placeholder="Your email address"
                  readOnly={true}
                  disabled
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio" className="flex items-center gap-2 font-medium">
                  <UserIcon className="h-4 w-4 text-primary/80" /> 
                  Biography <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                </Label>
                {!isEditingBio && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditingBio(true)}
                    className="h-8 px-2 text-primary"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <Textarea
                  id="bio"
                  className="bg-slate-800/50 border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent min-h-28"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    setIsEditingBio(true);
                  }}
                  readOnly={!isEditingBio}
                />
                
                {isEditingBio && (
                  <div className="flex justify-end">
                    <Button 
                      className="bg-primary/90 hover:bg-primary text-white"
                      onClick={updateBio}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Biography
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="personality" className="flex items-center gap-2 font-medium">
                  <BrainIcon className="h-4 w-4 text-primary/80" /> 
                  Personality <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                </Label>
                {!isEditingPersonality && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditingPersonality(true)}
                    className="h-8 px-2 text-primary"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <Input
                  type="text"
                  id="personality"
                  value={personality}
                  onChange={(e) => {
                    setPersonality(e.target.value);
                    setIsEditingPersonality(true);
                  }}
                  className="bg-slate-800/50 border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter personality traits (e.g., Creative, Analytical, Friendly)"
                  readOnly={!isEditingPersonality}
                />
                
                {isEditingPersonality && (
                  <div className="flex justify-end">
                    <Button 
                      className="bg-primary/90 hover:bg-primary text-white"
                      onClick={updatePersonality}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Personality
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Change Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={(open) => {
        if (!open) {
          // Reset form state when dialog is closed
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordError("");
        }
        setIsChangePasswordOpen(open);
      }}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockIcon className="h-5 w-5 text-primary" /> Change Password
            </DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {passwordError && (
              <div className="bg-destructive/20 text-destructive text-sm p-3 rounded-md">
                {passwordError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">
                Current Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  className="pr-10 bg-slate-800/90 border-slate-700"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:cursor-pointer"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isChangingPassword}
                >
                  {showCurrentPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  className="pr-10 bg-slate-800/90 border-slate-700"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isChangingPassword}
                >
                  {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10 bg-slate-800/90 border-slate-700"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isChangingPassword}
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChangePasswordOpen(false)}
              className="border-slate-700 hover:cursor-pointer"
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-primary hover:bg-primary/90 hover:cursor-pointer"
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default ProfilePage;