'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/lib/utils';
// import api from '@/lib/axiosInstance';

interface UserDetails {
  id: string;
  bio: string;
  personality: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar: string | null;
  };
  userPersona: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
}

interface PersonaContextType {
  currentPersonaId: string | null;
  setCurrentPersona: (personaId: string) => void;
  clearCurrentPersona: () => void;
  userDetails: UserDetails | null;
  isLoadingUserDetails: boolean;
  userError: string | null;
  fetchUserDetails: () => Promise<void>;
  getCurrentPersonaId: () => Promise<string | null>; 
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

interface PersonaProviderProps {
  children: ReactNode;
}

export const PersonaProvider: React.FC<PersonaProviderProps> = ({ children }) => {
  const [currentPersonaId, setCurrentPersonaIdState] = useState<string | null>(null);

  // User details state
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      setIsLoadingUserDetails(true);
      setUserError(null);
      const baseURL = process.env.NEXT_PUBLIC_API_URL +'/api' || BaseUrl + '/api';
      const response = await axios.get(`${baseURL}/user/user-details`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setUserDetails(response.data.data);
        
        // If user has an active persona, set it as current
        if (response.data.data.userPersona) {
          setCurrentPersona(response.data.data.userPersona.id);
        }
      } else {
        setUserError(response.data.message || 'Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserError('Failed to fetch user details');
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  // Get current persona ID, fetching from API if null
  const getCurrentPersonaId = async (): Promise<string | null> => {
    if (currentPersonaId) {
      return currentPersonaId;
    }
    
    // If currentPersonaId is null, try to fetch from API
    if (!isLoadingUserDetails && !userDetails) {
      await fetchUserDetails();
    }
    
    return userDetails?.userPersona?.id || null;
  };

  // Handler functions
  const setCurrentPersona = (personaId: string) => {
    setCurrentPersonaIdState(personaId);
  };

  const clearCurrentPersona = () => {
    setCurrentPersonaIdState(null);
  };

  // Value object to be provided to consumers
  const value: PersonaContextType = {
    currentPersonaId,
    setCurrentPersona,
    clearCurrentPersona,
    userDetails,
    isLoadingUserDetails,
    userError,
    fetchUserDetails,
    getCurrentPersonaId
  };

  return React.createElement(
    PersonaContext.Provider,
    { value },
    children
  );
};

// Custom hook to use the persona context
export const usePersonaPreferences = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  
  if (context === undefined) {
    throw new Error('usePersonaPreferences must be used within a PersonaProvider');
  }
  
  return context;
};

export const useCurrentPersona = () => {
  const { currentPersonaId, setCurrentPersona, clearCurrentPersona, getCurrentPersonaId } = usePersonaPreferences();
  return { currentPersonaId, setCurrentPersona, clearCurrentPersona, getCurrentPersonaId };
};

// Hook for accessing user details
export const useUserDetails = () => {
  const { userDetails, isLoadingUserDetails, userError, fetchUserDetails } = usePersonaPreferences();
  return { userDetails, isLoadingUserDetails, userError, fetchUserDetails };
};
