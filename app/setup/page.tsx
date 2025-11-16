"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EnvVariable {
  name: string;
  value: string | undefined;
  required: boolean;
  description: string;
  category: string;
  example?: string;
  isSet: boolean;
}

interface EnvCheckResult {
  isComplete: boolean;
  totalVariables: number;
  missingVariables: number;
  categories: {
    [key: string]: {
      name: string;
      description: string;
      variables: EnvVariable[];
      isComplete: boolean;
    };
  };
}

interface SetupInstructions {
  steps: Array<{
    title: string;
    description: string;
    instructions: string[];
    category: string;
    isRequired: boolean;
  }>;
}

export default function SetupPage() {
  const router = useRouter();
  const [envResult, setEnvResult] = useState<EnvCheckResult | null>(null);
  const [setupInstructions, setSetupInstructions] = useState<SetupInstructions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnvStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/setup/env-check');
      if (!response.ok) {
        throw new Error('Failed to fetch environment status');
      }
      const data = await response.json();
      setEnvResult(data);
      setSetupInstructions(data.setupInstructions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvStatus();
  }, []);

  // Auto-redirect when setup is complete
  useEffect(() => {
    if (envResult?.isComplete) {
      // Small delay to show the success state briefly
      const timer = setTimeout(() => {
        router.push('/en');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [envResult?.isComplete, router]);

  const handleRefresh = () => {
    fetchEnvStatus();
  };

  const handleCopyTemplate = () => {
    if (!envResult) return;
    
    const envContent = Object.entries(envResult.categories)
      .flatMap(([_, category]) => category.variables)
      .filter(variable => !variable.isSet && variable.required)
      .map(variable => `${variable.name}=${variable.example || 'your-value-here'}`)
      .join('\n');
    
    navigator.clipboard.writeText(envContent);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Loading...</h1>
              <p className="text-muted-foreground">Checking environment variables...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive">
                <span className="text-destructive">⚠</span>
                <span className="font-medium">Error</span>
              </div>
              <p className="text-destructive/80 mt-2">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!envResult || !setupInstructions) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">No Data</h1>
              <p className="text-muted-foreground">Unable to load environment status.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Application Setup
            </h1>
            <p className="text-lg text-muted-foreground">
              Configure your environment variables to get started
            </p>
          </div>

          {/* Overall Status */}
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
              {envResult.isComplete ? (
                <span className="text-success text-xl">✅</span>
              ) : (
                <span className="text-destructive text-xl">❌</span>
              )}
              <h2 className="text-xl font-semibold">
                Environment Status
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {envResult.isComplete
                ? "All required environment variables are configured. Redirecting to the application..."
                : `${envResult.missingVariables} of ${envResult.totalVariables} required variables are missing`}
            </p>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                envResult.isComplete 
                  ? 'bg-success/10 text-success' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {envResult.isComplete ? "Complete" : "Incomplete"}
              </span>
              <span className="text-sm text-muted-foreground">
                {envResult.totalVariables - envResult.missingVariables} / {envResult.totalVariables} configured
              </span>
              <button
                onClick={handleRefresh}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Simple Step-by-Step Setup */}
          {setupInstructions.steps.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Setup Steps
              </h2>
              
              {setupInstructions.steps.map((step, index) => (
                <div key={step.category} className="bg-card text-card-foreground rounded-lg shadow-sm border-l-4 border-l-primary p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {step.instructions.map((instruction, instructionIndex) => (
                      <div key={instructionIndex} className="flex items-start gap-3">
                        <span className="text-muted-foreground text-sm mt-1 font-mono">
                          {instructionIndex + 1}.
                        </span>
                        <p className="text-sm text-foreground">
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Show missing variables for this step */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Missing Variables:</h4>
                    <div className="space-y-2">
                      {envResult.categories[step.category]?.variables
                        .filter(variable => !variable.isSet && variable.required)
                        .map((variable) => (
                          <div key={variable.name} className="flex items-center gap-2">
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                              {variable.name}
                            </code>
                            <span className="text-xs text-destructive">❌ Missing</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 bg-accent/5 border border-accent/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-accent-foreground mb-4">
              Quick Actions
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={handleCopyTemplate}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
              >
                📋 Copy Template
              </button>
              <a 
                href="https://nextjs.org/docs/basic-features/environment-variables" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md text-sm"
              >
                🔗 Next.js Docs
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Create a <code className="bg-muted px-1 rounded">.env.local</code> file in your project root and add the required variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}