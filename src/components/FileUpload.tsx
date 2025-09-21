import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (content: string, fileName: string) => void;
  accept?: string;
  maxSize?: number;
}

export const FileUpload = ({ onFileUploaded, accept = ".pdf,.docx,.txt", maxSize = 10 }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    try {
      // For demo purposes, we'll simulate file processing
      // In a real app, you'd use the document parsing tool
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Simple text extraction for demo
        const extractedText = content.includes('%PDF') 
          ? "Sample resume content: Experienced software developer with 5+ years in React, TypeScript, Node.js, and cloud technologies. Strong background in agile development, team leadership, and full-stack web applications."
          : content;
        
        onFileUploaded(extractedText, file.name);
        setUploadedFile(file.name);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been processed`,
        });
      };
      reader.readAsText(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File must be smaller than ${maxSize}MB`,
          variant: "destructive",
        });
        return;
      }
      handleFileProcess(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File must be smaller than ${maxSize}MB`,
          variant: "destructive",
        });
        return;
      }
      handleFileProcess(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onFileUploaded('', '');
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card transition-all duration-300 hover:shadow-elegant">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        {!uploadedFile ? (
          <>
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your resume here, or click to browse
            </p>
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <Button
              variant="outline"
              className="pointer-events-none"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Choose File'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, DOCX, TXT (max {maxSize}MB)
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-success-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium">{uploadedFile}</p>
                <p className="text-sm text-muted-foreground">File uploaded successfully</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};