'use client';
import React from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { forgetPassword } from '@/lib/auth';
import { toast } from 'sonner';

function ForgotPasswordForm() {
    const [email, setEmail] = React.useState('');
    const handleSubmit = async () => {
        try {
            const { error } = await forgetPassword({
                email,
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) {
                console.error('Error sending reset link:', error);
                toast.error('Failed to send reset link. Please try again.');
                return;
            }
            toast.success('Password reset link sent to your email.');
            setEmail('');
        } catch (error) {
            console.error('Error sending reset link:', error);
            toast.error('Failed to send reset link. Please try again.');
        }
    };
  return (
    <Card className="bg-white/10  backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-700/50 relative z-10 overflow-hidden neo-border transform transition-all duration-300 hover:shadow-primary/10 hover:shadow-lg">
        <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent animate-gradient-slow">
                Forgot Password
            </h2>
            <p className="text-md text-muted-foreground">
                Enter your email to receive a password reset link.
            </p>
        </div>
        <Input 
            placeholder="Enter your email" 
            type="email"
            required
            autoComplete="email" 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="bg-gray-800/50 border-gray-700/50 text-white rounded-lg 
            focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 
            placeholder:text-gray-500 h-9 sm:h-10" 
        />
        <Button onClick={()=>handleSubmit()} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
            Send Reset Link
        </Button>
    </Card>
  )
}

export default ForgotPasswordForm