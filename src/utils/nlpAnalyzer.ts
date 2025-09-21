import { Matrix } from 'ml-matrix';

export interface AnalysisResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  topKeywords: { word: string; score: number }[];
  suggestions: string[];
}

export class ResumeAnalyzer {
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'can', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its',
    'our', 'their', 'from', 'up', 'about', 'into', 'over', 'after'
  ]);

  private extractSkills(text: string): string[] {
    const skillPatterns = [
      // Programming languages
      /\b(javascript|typescript|python|java|c\+\+|c#|ruby|php|swift|kotlin|go|rust|scala|r|matlab)\b/gi,
      // Frameworks and libraries
      /\b(react|angular|vue|node\.?js|express|django|flask|spring|laravel|rails|next\.?js|nuxt)\b/gi,
      // Databases
      /\b(mysql|postgresql|mongodb|redis|elasticsearch|oracle|sql\s?server|sqlite|cassandra)\b/gi,
      // Cloud and DevOps
      /\b(aws|azure|gcp|docker|kubernetes|jenkins|git|github|gitlab|bitbucket|terraform|ansible)\b/gi,
      // General skills
      /\b(agile|scrum|kanban|leadership|management|communication|teamwork|problem\s?solving)\b/gi,
      // Tools
      /\b(jira|confluence|slack|figma|sketch|photoshop|illustrator|excel|powerpoint|word)\b/gi
    ];

    const skills = new Set<string>();
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => skills.add(match.toLowerCase()));
      }
    });

    return Array.from(skills);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word));
  }

  private calculateTfIdf(tokens: string[]): Map<string, number> {
    const termFreq = new Map<string, number>();
    const totalTerms = tokens.length;

    // Calculate term frequency
    tokens.forEach(token => {
      termFreq.set(token, (termFreq.get(token) || 0) + 1);
    });

    // Convert to TF-IDF (simplified - using only TF for now)
    const tfidf = new Map<string, number>();
    termFreq.forEach((freq, term) => {
      tfidf.set(term, freq / totalTerms);
    });

    return tfidf;
  }

  private cosineSimilarity(vectorA: Map<string, number>, vectorB: Map<string, number>): number {
    const allKeys = new Set([...vectorA.keys(), ...vectorB.keys()]);
    const a: number[] = [];
    const b: number[] = [];

    allKeys.forEach(key => {
      a.push(vectorA.get(key) || 0);
      b.push(vectorB.get(key) || 0);
    });

    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  analyze(resumeText: string, jobDescription: string): AnalysisResult {
    // Extract skills
    const resumeSkills = this.extractSkills(resumeText);
    const jobSkills = this.extractSkills(jobDescription);

    const matchedSkills = resumeSkills.filter(skill => jobSkills.includes(skill));
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));

    // Tokenize texts
    const resumeTokens = this.tokenize(resumeText);
    const jobTokens = this.tokenize(jobDescription);

    // Calculate TF-IDF vectors
    const resumeVector = this.calculateTfIdf(resumeTokens);
    const jobVector = this.calculateTfIdf(jobTokens);

    // Calculate cosine similarity
    const similarity = this.cosineSimilarity(resumeVector, jobVector);
    const matchPercentage = Math.round(similarity * 100);

    // Get top keywords from job description
    const jobKeywords = Array.from(jobVector.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, score]) => ({ word, score: Math.round(score * 1000) / 1000 }));

    // Generate suggestions
    const suggestions = this.generateSuggestions(matchedSkills, missingSkills, matchPercentage);

    return {
      matchPercentage,
      matchedSkills,
      missingSkills,
      topKeywords: jobKeywords,
      suggestions
    };
  }

  private generateSuggestions(matched: string[], missing: string[], percentage: number): string[] {
    const suggestions: string[] = [];

    if (percentage < 30) {
      suggestions.push("Consider tailoring your resume more closely to this job description");
      suggestions.push("Add more relevant keywords from the job posting");
    } else if (percentage < 60) {
      suggestions.push("Good match! Consider highlighting more relevant experiences");
    } else {
      suggestions.push("Excellent match! Your resume aligns well with this position");
    }

    if (missing.length > 0) {
      suggestions.push(`Consider adding these skills to your resume: ${missing.slice(0, 3).join(', ')}`);
    }

    if (matched.length > 0) {
      suggestions.push(`Great! You have these relevant skills: ${matched.slice(0, 3).join(', ')}`);
    }

    return suggestions;
  }
}