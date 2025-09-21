import { useState } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ResumeAnalyzer, AnalysisResult } from '@/utils/nlpAnalyzer';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Target, Users, TrendingUp } from 'lucide-react';

interface ResumeComparison {
  id: string;
  fileName: string;
  analysisResult: AnalysisResult;
  uploadDate: Date;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'analyzer' | 'dashboard'>('analyzer');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisons, setComparisons] = useState<ResumeComparison[]>([]);
  const { toast } = useToast();

  const analyzer = new ResumeAnalyzer();

  const handleFileUploaded = (content: string, fileName: string) => {
    setResumeText(content);
    setResumeFileName(fileName);
    // Clear previous analysis when new file is uploaded
    setAnalysisResult(null);
  };

  const handleJobDescriptionChange = (description: string) => {
    setJobDescription(description);
    if (resumeText && description) {
      performAnalysis(resumeText, description);
    }
  };

  const performAnalysis = async (resume: string, job: string) => {
    if (!resume.trim() || !job.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload a resume and enter a job description",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = analyzer.analyze(resume, job);
      setAnalysisResult(result);

      // Add to comparisons if we have a valid result
      if (resumeFileName) {
        const newComparison: ResumeComparison = {
          id: Date.now().toString(),
          fileName: resumeFileName,
          analysisResult: result,
          uploadDate: new Date(),
        };
        setComparisons(prev => [...prev.filter(c => c.fileName !== resumeFileName), newComparison]);
      }

      toast({
        title: "Analysis Complete",
        description: `Resume matches ${result.matchPercentage}% with the job requirements`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveComparison = (id: string) => {
    setComparisons(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Resume Removed",
      description: "The resume comparison has been removed from your dashboard",
    });
  };

  const handleAddNew = () => {
    setCurrentView('analyzer');
    // Reset the analyzer
    setResumeText('');
    setResumeFileName('');
    setAnalysisResult(null);
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <Header onViewChange={setCurrentView} currentView={currentView} />
        <Dashboard 
          comparisons={comparisons}
          onRemoveComparison={handleRemoveComparison}
          onAddNew={handleAddNew}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onViewChange={setCurrentView} currentView={currentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">AI-Powered Resume Analysis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Smart Resume Matcher
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Optimize your resume for any job with AI-powered analysis. Get instant feedback, 
            match scores, and actionable suggestions to land your dream job.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-gradient-card shadow-card text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Precise Matching</h3>
              <p className="text-sm text-muted-foreground">
                Advanced NLP algorithms analyze your resume against job requirements
              </p>
            </Card>
            <Card className="p-6 bg-gradient-card shadow-card text-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Instant Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Get real-time insights and suggestions to improve your match score
              </p>
            </Card>
            <Card className="p-6 bg-gradient-card shadow-card text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Compare Resumes</h3>
              <p className="text-sm text-muted-foreground">
                Test multiple resume versions against the same job posting
              </p>
            </Card>
          </div>
        </div>

        {/* Main Analysis Interface */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <FileUpload 
              onFileUploaded={handleFileUploaded}
              accept=".pdf,.docx,.txt"
              maxSize={10}
            />
            <JobDescriptionInput 
              onJobDescriptionChange={handleJobDescriptionChange}
              jobDescription={jobDescription}
            />
          </div>

          <div className="space-y-6">
            {analysisResult ? (
              <AnalysisResults result={analysisResult} isLoading={isAnalyzing} />
            ) : (
              <Card className="p-12 text-center bg-gradient-card shadow-card">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your resume and paste a job description to get started
                </p>
                <Button 
                  variant="hero"
                  onClick={() => performAnalysis(resumeText, jobDescription)}
                  disabled={!resumeText || !jobDescription || isAnalyzing}
                  className="transition-all duration-300"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {comparisons.length > 0 && (
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Analysis History</h3>
                <p className="text-sm text-muted-foreground">
                  {comparisons.length} resume{comparisons.length !== 1 ? 's' : ''} analyzed
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>View Dashboard</span>
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;