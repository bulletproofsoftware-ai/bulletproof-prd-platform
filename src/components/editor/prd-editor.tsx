"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/prds/status-badge";
import { EditorToolbar } from "./editor-toolbar";
import { markdownToHtml, htmlToMarkdown } from "@/lib/markdown";
import { Send, Save, FileDown } from "lucide-react";
import { VersionHistory } from "./version-history";

type PrdData = {
  id: string;
  title: string;
  status: string;
  contentMd: string;
  source: string;
};

export function PrdEditor({ prd }: { prd: PrdData }) {
  const router = useRouter();
  const [title, setTitle] = useState(prd.title);
  const [saving, setSaving] = useState(false);
  const [staging, setStaging] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Placeholder.configure({ placeholder: "Start writing your PRD..." }),
      LinkExtension.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: markdownToHtml(prd.contentMd),
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6",
      },
    },
  });

  const save = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    const contentMd = htmlToMarkdown(editor.getHTML());
    await fetch(`/api/prds/${prd.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, contentMd }),
    });
    setLastSaved(new Date());
    setSaving(false);
  }, [editor, prd.id, title]);

  useEffect(() => {
    if (!editor) return;
    const handleUpdate = () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(save, 3000);
    };
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [editor, save]);

  async function handleStageForReview() {
    setStaging(true);
    await save();
    const res = await fetch(`/api/prds/${prd.id}/stage`, { method: "POST" });
    if (res.ok) {
      const { review } = await res.json();
      router.push(`/reviews/${review.id}`);
    }
    setStaging(false);
  }

  function handleSavePdf() {
    window.print();
  }

  const canStage = prd.status === "draft" || prd.status === "editing";

  return (
    <div className="flex h-full flex-col print:block print:h-auto print:overflow-visible" data-prd-editor="">
      <div className="flex items-center gap-4 border-b px-6 py-3 print:hidden" data-prd-header="">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-md border-none text-lg font-semibold shadow-none focus-visible:ring-0"
          onBlur={save}
        />
        <StatusBadge status={prd.status} />
        <div className="flex-1" />
        {lastSaved && (
          <span className="text-xs text-muted-foreground">
            {saving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString()}`}
          </span>
        )}
        <Button variant="outline" size="sm" onClick={save} disabled={saving}>
          <Save className="mr-1 h-3 w-3" /> Save
        </Button>
        <Button variant="outline" size="sm" onClick={handleSavePdf}>
          <FileDown className="mr-1 h-3 w-3" /> Save to PDF
        </Button>
        <VersionHistory prdId={prd.id} />
        {canStage && (
          <Button size="sm" onClick={handleStageForReview} disabled={staging}>
            <Send className="mr-1 h-3 w-3" /> {staging ? "Staging..." : "Stage for Review"}
          </Button>
        )}
      </div>
      <div data-prd-toolbar="" className="print:hidden"><EditorToolbar editor={editor} /></div>
      <div className="flex-1 overflow-auto print:overflow-visible print:h-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
