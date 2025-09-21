import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, TrendingUp, Users, Award, Plus, Trash2 } from 'lucide-react';
import { AnalysisResult } from '@/utils/nlpAnalyzer';

interface ResumeComparison {
  id: string;
  fileName: string;
  analysisResult: AnalysisResult;
  uploadDate: Date;
}

interface DashboardProps {
  comparisons: ResumeComparison[];
  onRemoveComparison: (id: string) => void;
  onAddNew: () => void;
}

export const Dashboard = ({ comparisons, onRemoveComparison, onAddNew }: DashboardProps) => {
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');

  const sortedComparisons = [...comparisons].sort((a, b) => {
    if (sortBy === 'score') {
      return b.analysisResult.matchPercentage - a.analysisResult.matchPercentage;
    }
    return b.uploadDate.getTime() - a.uploadDate.getTime();
  });

  const avgScore = comparisons.length > 0 
    ? Math.round(comparisons.reduce((sum, comp) => sum + comp.analysisResult.matchPercentage, 0) / comparisons.length)
    : 0;

  const topScore = comparisons.length > 0 
    ? Math.max(...comparisons.map(comp => comp.analysisResult.matchPercentage))
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 70) return 'default';
    if (score >= 40) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Resume Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Compare multiple resumes against the same job description
          </p>
        </div>
        <Button onClick={onAddNew} className="bg-gradient-primary text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Add Resume
        </Button>
      </div>

      {comparisons.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-card shadow-card">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Resumes to Compare</h3>
          <p className="text-muted-foreground mb-6">
            Upload your first resume to start comparing against job descriptions
          </p>
          <Button onClick={onAddNew} className="bg-gradient-primary text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
        </Card>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Resumes</p>
                  <p className="text-2xl font-bold">{comparisons.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</p>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(topScore)}`}>{topScore}%</p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-success" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Above 70%</p>
                  <p className="text-2xl font-bold text-success">
                    {comparisons.filter(c => c.analysisResult.matchPercentage >= 70).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
              </div>
            </Card>
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Resume Comparisons</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button
                variant={sortBy === 'score' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('score')}
              >
                Score
              </Button>
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('date')}
              >
                Date
              </Button>
            </div>
          </div>

          {/* Resume Comparison Cards */}
          <div className="grid gap-6">
            {sortedComparisons.map((comparison, index) => (
              <Card key={comparison.id} className="p-6 bg-gradient-card shadow-card transition-all duration-300 hover:shadow-elegant">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{comparison.fileName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {comparison.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={getScoreBadgeVariant(comparison.analysisResult.matchPercentage)}>
                      {comparison.analysisResult.matchPercentage}% Match
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveComparison(comparison.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Matched Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {comparison.analysisResult.matchedSkills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-success/10 text-success">
                          {skill}
                        </Badge>
                      ))}
                      {comparison.analysisResult.matchedSkills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{comparison.analysisResult.matchedSkills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {comparison.analysisResult.missingSkills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-warning/30 text-warning">
                          {skill}
                        </Badge>
                      ))}
                      {comparison.analysisResult.missingSkills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{comparison.analysisResult.missingSkills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Top Suggestion</p>
                    <p className="text-sm">
                      {comparison.analysisResult.suggestions[0] || 'Great job on your resume!'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};