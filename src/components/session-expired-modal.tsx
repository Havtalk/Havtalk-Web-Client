"use client";
import { useAuthContext } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SessionExpiredModal() {
  const { sessionExpired, resetSessionExpired } = useAuthContext();

  const handleLogin = () => {
    resetSessionExpired();
    window.location.href = "/auth/login";
  };

  const handleSignup = () => {
    resetSessionExpired();
    window.location.href = "/auth/register";
  };

  return (
    <Dialog open={sessionExpired} onOpenChange={resetSessionExpired}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm bg-opacity-60" />
      <DialogContent className="sm:max-w-md bg-background/90">
        <div className="flex justify-center mb-4 w-full">
          <div className="relative w-[160px] h-[200px] overflow-hidden rounded-xl">
            <Image
              src="/auth/session-expired-anime.png"
              alt="Session Expired Character"
              fill
              className="object-cover object-top drop-shadow-lg"
                // sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
              priority
            />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Session Expired
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Your session has expired due to inactivity. Please log in again to
            continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Button variant="default" onClick={handleLogin} className="flex-1">
            Login
          </Button>
          <Button variant="outline" onClick={handleSignup} className="flex-1">
            Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
