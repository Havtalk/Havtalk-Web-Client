'use client';
import React from 'react'
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import {z} from 'zod';
import { toast } from 'sonner';
import { resetPassword } from '@/lib/auth';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const token=useSearchParams().get('token');
    console.log('Reset token:', token);
    const schema = z.object({
        password: z.string()
            .min(6, { message: 'Password must be at least 6 characters' })
            .max(20, { message: 'Password must be at most 20 characters' })
            .regex(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                { message: 'Password must contain at least one letter, one number, and one special character' }
            ),
        confirmPassword: z.string()
            .min(6, { message: 'Please confirm your password' }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    const handleSubmit = async () => {
        try {
            const result = schema.safeParse({ password, confirmPassword });
            if (!result.success) {
                console.error('Validation errors:', result.error.errors);
                toast.error(result.error.errors[0].message);
                return;
            }
            console.log('Password reset successfully:', password);
            const {error}=await resetPassword({
                newPassword: password,
                token: token!,
            });
            if (error) {
                console.error('Error resetting password:', error);
                toast.error('Failed to reset password. Please try again.');
                return;
            }
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Failed to reset password. Please try again.');
        }
    };

    return (
    <Card className="bg-white/10  backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700/50 relative z-10 overflow-hidden neo-border transform transition-all duration-300 hover:shadow-primary/10 hover:shadow-lg">
        <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent animate-gradient-slow">
                Reset Your Password
            </h2>
            <p className="text-md text-muted-foreground">
                Enter new password to reset your account password.
            </p>
        </div>
        <div className="relative">
            <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            onChange={(e) => setPassword(e.target.value)}
            value={password} 
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
        <div className="relative">
            <Input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
                focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all duration-300
                placeholder:text-gray-500 h-9 sm:h-10 pr-10" 
            />
            <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                tabIndex={-1}
            >
            {showConfirmPassword ? 
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            }
            </button>
        </div>
        
        <Button onClick={()=>handleSubmit()} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
            Reset Password
        </Button>
    </Card>
        
  )
}

export default ResetPasswordForm