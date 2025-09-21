import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Github, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onViewChange: (view: 'analyzer' | 'dashboard') => void;
  currentView: 'analyzer' | 'dashboard';
}

export const Header = ({ onViewChange, currentView }: HeaderProps) => {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Smart Resume Matcher</h1>
                <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            <Button
              variant={currentView === 'analyzer' ? 'default' : 'ghost'}
              onClick={() => onViewChange('analyzer')}
              className="flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>Analyzer</span>
            </Button>
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onViewChange('dashboard')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Source</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};