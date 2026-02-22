import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

let supabaseInstance: SupabaseClient;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: Supabase credentials not configured. Database features will not work.');
  // Create a mock client for development without database
  supabaseInstance = new Proxy({} as SupabaseClient, {
    get() {
      return () => Promise.resolve({ data: null, error: new Error('Database not configured') });
    },
  });
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseInstance;

// Database types
export interface Simulation {
  id: string;
  user_id: string;
  decision: string;
  factors: {
    riskTolerance: number;
    financialStability: number;
    disciplineLevel: number;
    supportSystem: number;
  };
  results: {
    threeMonths: any;
    oneYear: any;
    fiveYears: any;
    summary: string;
    alternativePath: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SavedScenario {
  id: string;
  user_id: string;
  simulation_id: string;
  name: string;
  notes: string;
  created_at: string;
}
