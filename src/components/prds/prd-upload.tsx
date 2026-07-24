"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function PrdUpload() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".md")) {
      setFile(dropped);
      dropped.text().then(setPreview);
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected?.name.endsWith(".md")) {
      setFile(selected);
      selected.text().then(setPreview);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/prds/upload", { method: "POST", body: formData });
    if (res.ok) {
      const prd = await res.json();
      router.push(`/prds/${prd.id}`);
    }
    setUploading(false);
  }

  return (
    <div className="space-y-6">
      <Card
        className="cursor-pointer border-dashed"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Drop a markdown file here or click to browse</p>
            <p className="text-sm text-muted-foreground">Only .md files are supported</p>
          </div>
          <input id="file-input" type="file" accept=".md" className="hidden" onChange={handleFileChange} />
        </CardContent>
      </Card>
      {preview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Preview: {file?.name}</h2>
            <Button onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Save as PRD"}</Button>
          </div>
          <Card>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none py-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
