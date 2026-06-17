// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase, supabaseAdmin, DoctorProfile } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  role?: 'doctor';
  specialization?: string;
  registrationNumber?: string;
  qualification?: string;
  yearsOfExperience?: string;
  aboutMe?: string;
  consultationFee?: string;
  timings?: string;
  dateOfBirth?: string;
  gender?: string;
  languages?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: DoctorProfile | null;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  updateProfile: (data: Partial<DoctorProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchDoctorProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchDoctorProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDoctorProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('🔍 Fetching profile for user:', supabaseUser.id);
      
      const { data: doctorData, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching doctor profile:', error);
        setLoading(false);
        return;
      }

      if (doctorData) {
        console.log('✅ Profile found:', doctorData);
        const userData: User = {
          id: supabaseUser.id,
          fullName: doctorData.full_name,
          email: doctorData.email || supabaseUser.email || '',
          phoneNumber: doctorData.phone_number,
          role: doctorData.role,
          specialization: doctorData.specialization,
          registrationNumber: doctorData.registration_number,
          qualification: doctorData.qualification,
          yearsOfExperience: doctorData.years_of_experience,
          aboutMe: doctorData.about_me,
          consultationFee: doctorData.consultation_fee,
          timings: doctorData.timings,
          dateOfBirth: doctorData.date_of_birth,
          gender: doctorData.gender,
          languages: doctorData.languages,
          isVerified: doctorData.is_verified,
        };
        setUser(userData);
        setProfile(doctorData);
        setIsAuthenticated(true);
      } else {
        console.log('ℹ️ No profile found for user');
        const userData: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          phoneNumber: supabaseUser.phone || '',
          fullName: supabaseUser.user_metadata?.full_name,
          role: 'doctor',
        };
        setUser(userData);
        setProfile(null);
        setIsAuthenticated(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching doctor profile:', error);
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      console.log('🔑 Attempting login with:', identifier);
      
      const isEmail = identifier.includes('@');
      let email = identifier;
      
      if (!isEmail) {
        const { data: doctor } = await supabase
          .from('doctor_profiles')
          .select('email')
          .eq('phone_number', identifier)
          .maybeSingle();
        
        if (doctor && doctor.email) {
          email = doctor.email;
        } else {
          email = `${identifier}@swasthya.com`;
        }
      }
      
      console.log('📧 Logging in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        throw error;
      }
      
      console.log('✅ Login successful:', data.user?.id);
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      console.log('📝 Starting signup with data:', userData);
      
      const email = userData.email;
      const password = userData.password;

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: userData.fullName,
            phone: userData.phoneNumber,
            role: 'doctor',
          },
        },
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      console.log('✅ User created successfully:', authData.user.id);

      // Wait for user to be created
      console.log('⏳ Waiting for user to be fully created...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create doctor profile using ONLY admin client (bypasses RLS)
      const profileData = {
        user_id: authData.user.id,
        full_name: userData.fullName,
        email: email,
        phone_number: userData.phoneNumber,
        specialization: userData.specialization || null,
        registration_number: userData.medicalRegNumber || null,
        role: 'doctor',
        is_verified: false,
      };

      console.log('📝 Creating profile with data:', profileData);

      // ONLY use admin client to bypass RLS
      const { data: profileResult, error: profileError } = await supabaseAdmin
        .from('doctor_profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        
        // If admin client fails, try with RPC function
        console.log('🔄 Trying with RPC function...');
        const { data: rpcResult, error: rpcError } = await supabase.rpc('create_doctor_profile', {
          p_user_id: authData.user.id,
          p_full_name: userData.fullName,
          p_email: email,
          p_phone_number: userData.phoneNumber,
          p_specialization: userData.specialization || null,
          p_registration_number: userData.medicalRegNumber || null,
        });
        
        if (rpcError) {
          console.error('❌ RPC also failed:', rpcError);
          throw new Error('Failed to create doctor profile. Please contact support.');
        }
        
        console.log('✅ Profile created with RPC:', rpcResult);
      } else {
        console.log('✅ Profile created successfully:', profileResult);
      }

      console.log('✅ Signup completed successfully');

    } catch (error: any) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<DoctorProfile>) => {
    if (!user?.id) throw new Error('User not authenticated');

    const dbData: any = {};
    if (data.full_name !== undefined) dbData.full_name = data.full_name;
    if (data.date_of_birth !== undefined) dbData.date_of_birth = data.date_of_birth;
    if (data.email !== undefined) dbData.email = data.email;
    if (data.phone_number !== undefined) dbData.phone_number = data.phone_number;
    if (data.gender !== undefined) dbData.gender = data.gender;
    if (data.languages !== undefined) dbData.languages = data.languages;
    if (data.specialization !== undefined) dbData.specialization = data.specialization;
    if (data.qualification !== undefined) dbData.qualification = data.qualification;
    if (data.registration_number !== undefined) dbData.registration_number = data.registration_number;
    if (data.years_of_experience !== undefined) dbData.years_of_experience = data.years_of_experience;
    if (data.about_me !== undefined) dbData.about_me = data.about_me;
    if (data.consultation_fee !== undefined) dbData.consultation_fee = data.consultation_fee;
    if (data.timings !== undefined) dbData.timings = data.timings;

    const { error } = await supabase
      .from('doctor_profiles')
      .update(dbData)
      .eq('user_id', user.id);

    if (error) throw error;

    // Refresh profile
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      await fetchDoctorProfile(currentUser);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      loading,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};