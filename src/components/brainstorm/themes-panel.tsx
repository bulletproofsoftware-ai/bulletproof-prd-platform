import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function ThemesPanel({ themes }: { themes: string[] }) {
  const uniqueThemes = [...new Set(themes)];
  if (uniqueThemes.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          Themes will appear as the conversation develops.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4" /> Emerging Themes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {uniqueThemes.map((theme) => (
            <Badge key={theme} variant="secondary" className="text-xs">{theme}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
