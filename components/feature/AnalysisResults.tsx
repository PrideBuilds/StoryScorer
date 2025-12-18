"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Check,
} from "lucide-react";
import type { INVESTAnalysisResult } from "@/types/database";

interface AnalysisResultsProps {
  analysis: INVESTAnalysisResult;
}

const criteriaLabels = {
  independent: "Independent",
  negotiable: "Negotiable",
  valuable: "Valuable",
  estimable: "Estimable",
  small: "Small",
  testable: "Testable",
} as const;

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBadgeVariant = (
  score: number
): "default" | "secondary" | "destructive" => {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
};

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const [expandedCriteria, setExpandedCriteria] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const toggleCriterion = (criterion: string) => {
    setExpandedCriteria((prev) =>
      prev.includes(criterion)
        ? prev.filter((c) => c !== criterion)
        : [...prev, criterion]
    );
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exportToMarkdown = () => {
    const markdown = `# Story Analysis Results

## Overall Score: ${analysis.overall_score}/100

${Object.entries(criteriaLabels)
  .map(([key, label]) => {
    const criterion = analysis[key as keyof typeof criteriaLabels];
    return `### ${label}: ${criterion.score}/100
${criterion.feedback}`;
  })
  .join("\n\n")}

## Recommendations
${analysis.recommendations.map((rec) => `- ${rec}`).join("\n")}
`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `story-analysis-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analysis Results</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToMarkdown}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div
              className={`text-6xl font-bold mb-2 ${getScoreColor(
                analysis.overall_score
              )}`}
            >
              {analysis.overall_score}
            </div>
            <div className="text-2xl text-muted-foreground mb-4">/ 100</div>
            <Progress
              value={analysis.overall_score}
              className="h-3 max-w-md mx-auto"
            />
            <p className="text-sm text-muted-foreground mt-4">
              Overall INVEST Score
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Individual Criteria */}
      <div className="space-y-4">
        {Object.entries(criteriaLabels).map(([key, label], index) => {
          const criterion = analysis[key as keyof typeof criteriaLabels];
          const isExpanded = expandedCriteria.includes(key);
          const score = criterion.score;

          return (
            <Card key={key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {score >= 60 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <CardTitle className="text-lg">{label}</CardTitle>
                    <Badge variant={getScoreBadgeVariant(score)}>
                      {score}/100
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCriterion(key)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Progress value={score} className="mt-3" />
              </CardHeader>
              {isExpanded && (
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {criterion.feedback}
                    </p>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(criterion.feedback, index)
                        }
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
