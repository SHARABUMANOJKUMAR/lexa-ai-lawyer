import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type CaseCategory = 'criminal' | 'civil' | 'family' | 'property' | 'consumer' | 'cyber' | 'labor' | 'constitutional' | 'other';
type CaseStatus = 'draft' | 'submitted' | 'under_review' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

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
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    if (!user) {
      setCases([]);
      setLoading(false);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [user]);

  const createCase = async (caseData: {
    title: string;
    description: string;
    category: CaseCategory;
    incident_date?: string;
    incident_location?: string;
    accused_name?: string;
    accused_details?: string;
    ipc_sections?: string[];
    bns_sections?: string[];
  }) => {
    if (!user) {
      toast.error('Please login to create a case');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('cases')
        .insert({
          ...caseData,
          user_id: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      
      setCases((prev) => [data, ...prev]);
      toast.success('Case created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
      return null;
    }
  };

  const updateCase = async (id: string, updates: Partial<Omit<Case, 'id' | 'created_at' | 'updated_at'>>) => {
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
      return data;
    } catch (error) {
      console.error('Error updating case:', error);
      toast.error('Failed to update case');
      return null;
    }
  };

  const deleteCase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCases((prev) => prev.filter((c) => c.id !== id));
      toast.success('Case deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting case:', error);
      toast.error('Failed to delete case');
      return false;
    }
  };

  return {
    cases,
    loading,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
  };
};
