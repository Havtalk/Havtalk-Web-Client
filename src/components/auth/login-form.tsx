'use client'
import React, { useState } from 'react'
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
import { Loader2, Lock, Mail, Star, Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/auth';
import { toast } from 'sonner'
import { useRouter } from '@bprogress/next/app';
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
//   .min(6, { message: 'Password must be at least 6 characters' }),
})

type FormValues = z.infer<typeof formSchema>

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    
    try {
      const { email, password } = data;
      const {error} = await signIn.email({
        email,
        password,
      });

      if (error){
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
        else if(error.code == "USER_EMAIL_NOT_FOUND") {
            form.setError('root', { 
                message: 'User does not exist. Please register.' 
            })
        } else if(error.code == "INVALID_PASSWORD") {
            form.setError('root', { 
                message: 'Invalid Password or email. Please try again.' 
            })
        } else if(error.code == "USER_NOT_FOUND") {
            form.setError('root', { 
                message: 'User not found. Please register.' 
            })
        }else {
            form.setError('root', { 
                message: 'Login failed. Please try again.' 
            })
        }
        return;
      }
      toast.success('Login successful! Welcome back!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          backgroundColor: '#1a202c', // Dark background
          color: '#fff', // White text
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      });

      router.push('/dashboard');
      
    } catch (error) {
      console.error('Login failed:', error)
      form.setError('root', { 
        message: 'Invalid credentials. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      });
      
      if (error) {
        toast.error('Google sign-in failed. Please try again.', {
          duration: 3000,
          position: 'bottom-right',
        });
        return;
      }
      
      toast.success('Login successful! Welcome back!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          backgroundColor: '#1a202c',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error)
      toast.error('Authentication failed. Please try again.', {
        duration: 3000,
        position: 'bottom-right',
      });
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mt-6 md:mt-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -right-24 top-1/3 h-48 w-48 rounded-full bg-secondary/20 blur-3xl"></div>
      <div className="absolute bottom-12 right-12 h-32 w-32 rounded-full bg-accent/20 blur-3xl"></div>
      
      {/* Form container */}
      <div className="p-5 sm:p-8 rounded-xl bg-white/10 backdrop-blur-md border border-gray-700/50 shadow-2xl relative z-10 
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
            Welcome Back
          </h2>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Sign in to continue your journey</p>
        </div>
        
        {/* Google Sign-in Button */}
        <Button 
          type="button" 
          variant="outline"
          className="w-full mb-4 bg-gray-800/50 border-gray-700/50 text-white 
          font-medium py-2 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-800
          h-9 sm:h-10 flex items-center justify-center gap-2 relative overflow-hidden group"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <>
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span className="text-sm sm:text-base">Continue with Google</span>
            </>
          )}
        </Button>
        
        {/* Divider */}
        <div className="relative flex items-center mb-4">
          <div className="flex-grow border-t border-gray-700/50"></div>
          <span className="flex-shrink mx-3 text-gray-400 text-xs sm:text-sm">or</span>
          <div className="flex-grow border-t border-gray-700/50"></div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-4 sm:space-y-5">
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
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
                        focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300
                        placeholder:text-gray-500 h-9 sm:h-10 pr-10" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? 
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        }
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs sm:text-sm" />
                  <FormDescription className="text-right text-xs sm:text-sm mt-1">
                    <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </Link>
                  </FormDescription>
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
                    <span>Entering Universe...</span>
                  </>
                ) : (
                  <span>Enter Universe</span>
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
          Don&apos;t have an account yet?{' '}
          <a href="/auth/register" className="relative font-medium bg-gradient-to-r from-primary via-primary/80 to-primary/90 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Create your universe
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginForm;