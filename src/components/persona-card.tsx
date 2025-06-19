import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoreVertical, Loader2 } from "lucide-react";
import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';
import { useRouter } from '@bprogress/next/app';
import api from '@/lib/axiosInstance';

interface PersonaCardProps {
  persona: Persona;
  isSelected?: boolean;
  onPersonaSelected: (id: string | null) => void; // Add callback to notify parent
}

interface Persona {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

function PersonaCard({ persona, isSelected = false, onPersonaSelected }: PersonaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 400); 
    };
    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const { id, name, description, personality, avatar } = persona;

  const router=useRouter();

  const handleSelect = async(id: string | null) => {
    try {
      setIsSelecting(true);
      
      // const response = await axios.post(
      //   `${BaseUrl}/persona/set-current`, {
      //     personaId: id,
      //   }, {
      //     withCredentials: true,
      //   }
      // );
      const response = await api.post(
        `/persona/set-current`, 
        { personaId: id }, 
        { withCredentials: true }
      );
      
      if(response.status === 200 || response.data.success) {
        // Notify parent component that selection has changed
        onPersonaSelected(id);
        toast.success(id ? `${name} selected as current persona` : "Persona deselected");
      } else {
        toast.error("Failed to update persona selection");
        console.error("Error setting persona as current:", response.data.message);
      }
    } catch (error) {
      toast.error("Error updating persona selection");
      console.error("Error in handleSelect:", error);
    } finally {
      setIsSelecting(false);
    }
  };

  // Detect mobile (tailwind's sm: is 640px)
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;

  const handleCardClick = () => {
    // Only flip on mobile, and not when clicking the button
    if (isMobile) {
      setIsFlipped((prev) => !prev);
    }
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      handleSelect(null); // Unselect
    } else {
      handleSelect(id); // Select
    }
  };

  const handleDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(false);
    router.push(`/personas/${id}/edit`);
  };
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(false);
    router.push(`/personas/${id}`);
  };



  return (
    <div
      className={
        `perspective-[1000px] ${isSmallScreen?"w-11/12 h-[160px] mx-auto":"w-44 h-[200px]"} m-2 group sm:w-44 sm:h-[180px] xs:w-11/12 xs:h-[160px] xs:mx-auto` +
        (dropdownOpen ? " z-[9999]" : "")
      }
      onClick={handleCardClick}
    >
      <div
        className={
          "relative w-full h-full duration-500 preserve-3d transition-transform " +
          (isMobile
            ? (isFlipped ? "rotate-y-180" : "")
            : "group-hover:rotate-y-180")
        }
      >
        {/* Front of card */}
        <Card className="py-0 absolute w-full h-full flex flex-col backface-hidden border-2 border-border overflow-hidden ">
          <div className="relative w-full h-full">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              {avatar ? (
                <Image 
                  src={avatar} 
                  alt={name} 
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-5xl font-bold text-muted-foreground/30">
                    {name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Enhanced gradient overlay for better text visibility with more content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Title and description overlay */}
            <div className="absolute bottom-0 w-full p-2 z-10 pointer-events-none">
              <h3 className="text-lg font-bold text-white drop-shadow-md line-clamp-1">{name}</h3>
              <p className="text-xs text-white/90 drop-shadow-md line-clamp-2 mt-0.5 overflow-hidden">
                {description.length > 65 ? `${description.substring(0, 65)}...` : description}
              </p>
            </div>
            
            {isSelected && (
              <div className="absolute top-1 right-1 z-10 pointer-events-none">
                <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  Selected
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full flex flex-col p-3 backface-hidden rotate-y-180 bg-card border-2 border-border gap-2">
          <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-1 scrollbar-h-1  scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-h-px pr-1 space-y-2 my-1">
            <div>
              <h4 className="font-semibold text-xs text-foreground/80 mb-0.5">Description</h4>
              <p className="text-xs text-foreground/70">{description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs text-foreground/80 mb-0.5">Personality</h4>
              <p className="text-xs text-foreground/70">{personality}</p>
            </div>
          </div>
          <div className="mt-1 w-full flex flex-col gap-1 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row w-full gap-2">
              <Button
                variant="default"
                className="flex-1 text-xs h-7 relative z-20 cursor-pointer"
                onClick={handleSelectClick}
                disabled={isSelecting}
              >
                {isSelecting ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    {isSelected ? "Unselecting..." : "Selecting..."}
                  </>
                ) : (
                  isSelected ? "Unselect" : "Select"
                )}
              </Button>
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-muted transition"
                  onClick={handleDotsClick}
                  tabIndex={0}
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-8 z-[9999] min-w-[120px] bg-popover border border-border rounded shadow-lg py-1 flex flex-col"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-xs hover:bg-muted transition"
                      onClick={handleView}
                    >
                      View
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-xs hover:bg-muted transition"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PersonaCard;