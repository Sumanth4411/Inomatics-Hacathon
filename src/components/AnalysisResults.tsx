import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { AnalysisResult } from '@/utils/nlpAnalyzer';

interface AnalysisResultsProps {
  result: AnalysisResult;
  isLoading?: boolean;
}

export const AnalysisResults = ({ result, isLoading = false }: AnalysisResultsProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-success';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-success/10';
    if (percentage >= 40) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <Card className="p-6 bg-gradient-card shadow-card transition-all duration-300 hover:shadow-elegant">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getMatchBgColor(result.matchPercentage)} mb-4`}>
            <span className={`text-3xl font-bold ${getMatchColor(result.matchPercentage)}`}>
              {result.matchPercentage}%
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Resume Match Score</h3>
          <p className="text-muted-foreground">
            Your resume matches {result.matchPercentage}% with the job requirements
          </p>
          <Progress value={result.matchPercentage} className="mt-4" />
        </div>
      </Card>

      {/* Skills Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-semibold">Matched Skills</h4>
              <p className="text-sm text-muted-foreground">{result.matchedSkills.length} skills found</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matchedSkills.length > 0 ? (
              result.matchedSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-success/10 text-success border-success/20">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No matching skills detected</p>
            )}
          </div>
        </Card>

        {/* Missing Skills */}
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h4 className="font-semibold">Missing Skills</h4>
              <p className="text-sm text-muted-foreground">{result.missingSkills.length} skills to consider</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.length > 0 ? (
              result.missingSkills.slice(0, 8).map((skill, index) => (
                <Badge key={index} variant="outline" className="border-warning/30 text-warning">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Great! No critical skills missing</p>
            )}
          </div>
        </Card>
      </div>

      {/* Top Keywords */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Key Terms in Job Description</h4>
            <p className="text-sm text-muted-foreground">Important keywords to include in your resume</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {result.topKeywords.slice(0, 10).map((keyword, index) => (
            <div key={index} className="text-center p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-sm">{keyword.word}</p>
              <p className="text-xs text-muted-foreground">{(keyword.score * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold">Improvement Suggestions</h4>
            <p className="text-sm text-muted-foreground">Tips to enhance your resume</p>
          </div>
        </div>
        <div className="space-y-3">
          {result.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg">
              <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-accent">{index + 1}</span>
              </div>
              <p className="text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};