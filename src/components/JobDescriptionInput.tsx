import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  onJobDescriptionChange: (description: string) => void;
  jobDescription: string;
}

export const JobDescriptionInput = ({ onJobDescriptionChange, jobDescription }: JobDescriptionInputProps) => {
  const [localDescription, setLocalDescription] = useState(jobDescription);

  const handleSubmit = () => {
    onJobDescriptionChange(localDescription);
  };

  const loadSampleJob = () => {
    const sampleJob = `Senior Frontend Developer

We are looking for an experienced Frontend Developer to join our team. The ideal candidate will have:

Required Skills:
• 5+ years of experience with React and TypeScript
• Strong knowledge of modern JavaScript (ES6+)
• Experience with state management (Redux, Zustand)
• Proficiency in CSS frameworks (Tailwind CSS, Styled Components)
• Experience with build tools (Webpack, Vite)
• Knowledge of version control (Git, GitHub)
• Understanding of responsive web design
• Experience with REST APIs and GraphQL

Preferred Skills:
• Experience with Next.js or similar frameworks
• Knowledge of testing frameworks (Jest, Cypress)
• Familiarity with CI/CD pipelines
• Experience with Agile/Scrum methodologies
• Strong communication and teamwork skills
• Problem-solving mindset and attention to detail

Responsibilities:
• Develop and maintain web applications using React
• Collaborate with design and backend teams
• Write clean, maintainable, and testable code
• Participate in code reviews and technical discussions
• Optimize applications for performance and accessibility`;

    setLocalDescription(sampleJob);
    onJobDescriptionChange(sampleJob);
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card transition-all duration-300 hover:shadow-elegant">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Job Description</h3>
            <p className="text-sm text-muted-foreground">Paste the job posting here</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadSampleJob}
          className="flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Load Sample</span>
        </Button>
      </div>

      <div className="space-y-4">
        <Textarea
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          placeholder="Paste the job description here... Include required skills, responsibilities, and qualifications for the best analysis."
          className="min-h-[200px] resize-y"
        />
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {localDescription.length} characters
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!localDescription.trim()}
            className="bg-gradient-primary text-white hover:opacity-90 transition-all duration-300"
          >
            Analyze Match
          </Button>
        </div>
      </div>
    </Card>
  );
};