'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader2, Lock, Mail, User, UserCircle, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'
import { signUp } from '@/lib/auth';
import {ErrorContext} from 'better-auth/react';

// Define form schema using zod
const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' })
        .regex(/^[a-z0-9_]+$/, { message: 'Username can only contain lowercase letters, numbers, and underscores' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, { 
            message: 'Password must contain at least one letter and one number' 
        }).max(20, { message: 'Password must be at most 20 characters' }),
    confirmPassword: z.string().min(6, { message: 'Please confirm your password' })
})

type FormValues = z.infer<typeof formSchema>

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      setMousePosition({
        x: (clientX / innerWidth) * 2 - 1,
        y: (clientY / innerHeight) * 2 - 1,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    
    try {
      const { username, email, name, password } = data;
      const { data: response, error } = await signUp.email({
        email,
        password,
        username,
        name
      });
      if(error) {
        console.log('Registration error:', error);
        if( error.code=="INVALID_EMAIL"){
            form.setError('email', { 
                message: 'Invalid email address. Please enter a valid email.' 
            })
        }else if(error.code == "INVALID_EMAIL_OR_PASSWORD"){
            form.setError('root', { 
                message: 'Invalid email or password. Please try again.' 
            })
        }else if(error.code == "PASSWORD_TOO_SHORT"){
            form.setError('password', { 
                message: 'Password is too short. Minimum 8 characters required.' 
            })
        }
        else if(error.code == "PASSWORD_TOO_SHORT"){
            form.setError('password', { 
                message: 'Password is too short. Minimum 8 characters required.' 
            })
        }
        else if(error.code == "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER") {
            form.setError('username', { 
                message: 'Username is already taken. Please choose another.' 
            })
        } else if(error.code == "EMAIL_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER") {
            form.setError('email', { 
                message: 'Email is already taken. Please choose another.' 
            })
        } else if(error.code == "USER_ALREADY_EXISTS") {
            form.setError('email', { 
                message: 'User already exists. Please login.' 
            })
        }else {
            form.setError('root', { 
                message: 'Registration failed. Please try again.' 
            })
        }
        return;
      }
      
      console.log('Registration successful:', response);
      
      // Example notification for successful registration
      alert('Registration successful! (This is just a placeholder)')
      
    } catch (error) {
    console.log('Registration failed:', error);
      if (error instanceof Error && 
          error.message !== 'Email taken' && 
          error.message !== 'Username taken') {
        form.setError('root', { 
          message: 'Registration failed. Please try again.' 
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mt-6 md:mt-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -right-24 top-1/3 h-48 w-48 rounded-full bg-secondary/20 blur-3xl"></div>
      <div className="absolute bottom-12 right-12 h-32 w-32 rounded-full bg-accent/20 blur-3xl"></div>
      
      {/* Form container */}
      <div className="p-5 sm:p-8 rounded-xl bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 shadow-2xl relative z-10 
      overflow-hidden neo-border transform transition-all duration-300 hover:shadow-primary/10 hover:shadow-lg">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-gradient opacity-30"></div>
        
        {/* Light trail */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
        
        {/* Form title */}
        <div className="mb-6 text-center">
          {/* <div className="inline-block p-2 rounded-full bg-gray-800/50 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div> */}
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent animate-gradient-slow">
            Create Your Universe
          </h2>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Join our community of explorers</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-4 sm:space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                    <UserCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" /> Full Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field} 
                      className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
                      focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 
                      placeholder:text-gray-500 h-9 sm:h-10" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" /> Username
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="cosmic_voyager" 
                      {...field} 
                      className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
                      focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 
                      placeholder:text-gray-500 h-9 sm:h-10" 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
                    Your unique identifier in the universe
                  </FormDescription>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" /> Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      {...field} 
                      className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
                      focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 
                      placeholder:text-gray-500 h-9 sm:h-10" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" /> Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
                      focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300
                      placeholder:text-gray-500 h-9 sm:h-10" 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
                    Minimum 8 characters with uppercase, lowercase & number
                  </FormDescription>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" /> Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
                      focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300
                      placeholder:text-gray-500 h-9 sm:h-10" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-red-400 text-xs sm:text-sm font-medium p-2 sm:p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                {form.formState.errors.root.message}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white 
              font-bold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group relative overflow-hidden
              h-9 sm:h-10 mt-2"
              disabled={isLoading}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
              <span className="relative flex items-center justify-center text-sm sm:text-base">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4 animate-spin" /> 
                    <span>Creating Universe...</span>
                  </>
                ) : (
                  <span>Create Your Universe</span>
                )}
              </span>
            </Button>
          </form>
        </Form>
        
        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-300">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-500 animate-pulse" fill="currentColor" />
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400" fill="currentColor" />
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-500 animate-pulse-slow" fill="currentColor" />
          </div>
          Already have an account?{' '}
          <a href="/auth/login" className="relative font-medium bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Sign in to your universe
          </a>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm;
