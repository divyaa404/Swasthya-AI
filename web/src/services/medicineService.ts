// src/services/medicineService.ts
import { supabase } from '../lib/supabase';
import { Medicine } from '../types/medicine';

export const medicineService = {
  // Get all medicines
  async getAllMedicines(): Promise<Medicine[]> {
    try {
      console.log('🔍 Fetching medicines from Supabase...');
      
      // Just use 'Medicines' without quotes
      const { data, error } = await supabase
        .from('Medicines')
        .select('*');

      if (error) {
        console.error('❌ Error fetching medicines:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} medicines`);
      return data || [];
    } catch (error) {
      console.error('❌ Service error:', error);
      throw error;
    }
  },

  // Get medicine by ID
  async getMedicineById(id: string): Promise<Medicine | null> {
    try {
      const { data, error } = await supabase
        .from('Medicines')
        .select('*')
        .eq('Id', id)
        .single();

      if (error) {
        console.error('Error fetching medicine:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching medicine by ID:', error);
      throw error;
    }
  }
};