import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type CaseCategory = 'criminal' | 'civil' | 'family' | 'property' | 'consumer' | 'cyber' | 'labor' | 'constitutional' | 'other';
export type CaseStatus = 'draft' | 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export interface Case {
  id: string;
  case_number: string | null;
  title: string;
  description: string;
  category: CaseCategory;
  status: CaseStatus;
  incident_date: string | null;
  incident_location: string | null;
  accused_name: string | null;
  accused_details: string | null;
  ipc_sections: string[] | null;
  bns_sections: string[] | null;
  crpc_sections: string[] | null;
  ai_analysis: any;
  created_at: string;
  updated_at: string;
}

export const useCases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCases = async () => {
    if (!user) {
      setCases([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [user]);

  const createCase = async (caseData: {
    title: string;
    description: string;
    category: CaseCategory;
    status?: CaseStatus;
    incident_date?: string | null;
    incident_location?: string;
    accused_name?: string;
    accused_details?: string;
    ipc_sections?: string[];
    bns_sections?: string[];
    crpc_sections?: string[];
    ai_analysis?: any;
  }): Promise<{ data: Case | null; error: Error | null }> => {
    if (!user) {
      toast.error('Please login to create a case');
      return { data: null, error: new Error('Not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .insert({
          ...caseData,
          user_id: user.id,
          status: caseData.status || 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      
      setCases((prev) => [data, ...prev]);
      toast.success('Case created successfully!');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
      return { data: null, error };
    }
  };

  const updateCase = async (id: string, updates: Partial<Omit<Case, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: Case | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCases((prev) => prev.map((c) => (c.id === id ? data : c)));
      toast.success('Case updated successfully!');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating case:', error);
      toast.error('Failed to update case');
      return { data: null, error };
    }
  };

  const deleteCase = async (id: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCases((prev) => prev.filter((c) => c.id !== id));
      toast.success('Case deleted successfully!');
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting case:', error);
      toast.error('Failed to delete case');
      return { error };
    }
  };

  return {
    cases,
    isLoading,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
  };
};