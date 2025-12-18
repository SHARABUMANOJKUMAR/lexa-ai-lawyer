import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, FileText, Image, File, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
  mimeType?: string | null;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  filePath,
  fileName,
  mimeType
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && filePath) {
      loadFile();
    }
    return () => {
      if (fileUrl) {
        // URL.revokeObjectURL(fileUrl); // Don't revoke signed URLs
      }
    };
  }, [isOpen, filePath]);

  const loadFile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.storage
        .from('evidence')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      
      setFileUrl(data.signedUrl);
    } catch (err) {
      console.error("Error loading file:", err);
      setError("Failed to load file preview");
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (): 'image' | 'pdf' | 'document' | 'other' => {
    const type = mimeType?.toLowerCase() || '';
    const name = fileName.toLowerCase();
    
    if (type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(name)) {
      return 'image';
    }
    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      return 'pdf';
    }
    if (type.includes('word') || type.includes('document') || 
        /\.(doc|docx|txt|rtf)$/i.test(name)) {
      return 'document';
    }
    return 'other';
  };

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const fileType = getFileType();

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      );
    }

    if (error || !fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <File className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{error || "Unable to preview file"}</p>
          {fileUrl && (
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download Instead
            </Button>
          )}
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className="flex justify-center items-center max-h-[60vh] overflow-auto">
            <img 
              src={fileUrl} 
              alt={fileName}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-[60vh]">
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=0`}
              className="w-full h-full border-0 rounded-lg"
              title={fileName}
            />
          </div>
        );
      
      case 'document':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-20 h-20 text-primary mb-4" />
            <p className="text-lg font-medium mb-2">{fileName}</p>
            <p className="text-muted-foreground mb-6 text-center">
              Document preview not available in browser.<br/>
              Click below to download and view.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </a>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <File className="w-20 h-20 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{fileName}</p>
            <p className="text-muted-foreground mb-6">
              Preview not available for this file type
            </p>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        );
    }
  };

  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-gold-light flex items-center justify-center text-primary-foreground">
                {getFileIcon()}
              </div>
              <div>
                <DialogTitle className="text-lg">{fileName}</DialogTitle>
                <DialogDescription className="text-sm">
                  {mimeType || 'File preview'}
                </DialogDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {fileUrl && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4 overflow-auto">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;