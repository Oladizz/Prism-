import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProfile, updateProfile } from '../services/api';

interface Profile {
  fullName: string;
  username: string;
  email: string;
}

interface ProfileContextType {
    profile: Profile | null;
    loadProfile: () => void;
    saveProfile: (newProfile: Profile) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<Profile | null>(null);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    };

    const saveProfile = async (newProfile: Profile) => {
        try {
            const updated = await updateProfile(newProfile);
            setProfile(updated);
        } catch (error) {
            console.error('Failed to save profile:', error);
            throw error;
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, loadProfile, saveProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
