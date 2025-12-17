import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface EvidenceFile {
  id: string;
  case_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  ai_analysis: any;
  created_at: string;
}

export const useEvidence = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const uploadEvidence = async (
    caseId: string,
    file: File,
    description?: string
  ): Promise<EvidenceFile | null> => {
    if (!user) {
      toast.error('Please login to upload evidence');
      return null;
    }

    setUploading(true);
    
    try {
      // Upload to storage
      const filePath = `${user.id}/${caseId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { data, error: dbError } = await supabase
        .from('evidence_files')
        .insert({
          case_id: caseId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          description,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Evidence uploaded successfully!');
      return data;
    } catch (error) {
      console.error('Error uploading evidence:', error);
      toast.error('Failed to upload evidence');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const analyzeEvidence = async (
    evidenceId: string,
    fileName: string,
    fileType: string,
    description?: string,
    caseContext?: string
  ) => {
    setAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-evidence', {
        body: {
          fileName,
          fileType,
          description,
          caseContext,
        },
      });

      if (error) throw error;

      // Update evidence record with analysis
      await supabase
        .from('evidence_files')
        .update({ ai_analysis: { analysis: data.analysis } })
        .eq('id', evidenceId);

      toast.success('Evidence analyzed successfully!');
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing evidence:', error);
      toast.error('Failed to analyze evidence');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const getEvidenceUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('evidence')
      .createSignedUrl(filePath, 3600);
    
    return data?.signedUrl;
  };

  const deleteEvidence = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      await supabase.storage.from('evidence').remove([filePath]);
      
      // Delete from database
      const { error } = await supabase
        .from('evidence_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Evidence deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting evidence:', error);
      toast.error('Failed to delete evidence');
      return false;
    }
  };

  return {
    uploading,
    analyzing,
    uploadEvidence,
    analyzeEvidence,
    getEvidenceUrl,
    deleteEvidence,
  };
};
