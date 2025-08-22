import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { dataService } from '../services/dataService';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth bir AuthProvider içinde kullanılmalıdır');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = await dataService.getUserByEmail(email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = async (name: string, email: string, password: string, role: 'Teacher' | 'Student'): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = await dataService.getUserByEmail(email);
      if (existingUser) {
        return false;
      }

      // Create new user
      const newUser = await dataService.createUser({ name, email, role });
      
      // If new user is a teacher, generate availability slots and create profile
      if (role === 'Teacher') {
        await dataService.generateAvailabilityForTeacher(newUser.id);
        await dataService.createTeacherProfile({
          userId: newUser.id,
          branch: 'Genel',
          bio: `${newUser.name} öğretmeni için profil oluşturuldu. Lütfen detayları güncelleyin.`
        });
      }
      
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    signup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};