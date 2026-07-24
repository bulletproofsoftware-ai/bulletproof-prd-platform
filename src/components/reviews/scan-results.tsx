import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Copy, FileText } from "lucide-react";

type ScanFinding = { severity: string; title: string; description: string };
type DuplicationResult = { overlap: string; references: string[] };

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export function ScanResults({
  summary, securityFindings, duplicationResults,
}: {
  summary: string;
  securityFindings: ScanFinding[];
  duplicationResults: DuplicationResult[];
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4" /> AI Summary</CardTitle>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{summary}</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm"><Shield className="h-4 w-4" /> Security Scan</CardTitle>
        </CardHeader>
        <CardContent>
          {securityFindings.length === 0 ? (
            <p className="text-sm text-green-600 dark:text-green-400">No security issues found.</p>
          ) : (
            <div className="space-y-3">
              {securityFindings.map((finding, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={severityColors[finding.severity] || ""}>{finding.severity}</Badge>
                    <span className="text-sm font-medium">{finding.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{finding.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm"><Copy className="h-4 w-4" /> Duplication Scan</CardTitle>
        </CardHeader>
        <CardContent>
          {duplicationResults.length === 0 ? (
            <p className="text-sm text-green-600 dark:text-green-400">No duplication found.</p>
          ) : (
            <div className="space-y-3">
              {duplicationResults.map((result, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm">{result.overlap}</p>
                  <div className="flex flex-wrap gap-1">
                    {result.references.map((ref, j) => (
                      <Badge key={j} variant="outline" className="text-xs">{ref}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
