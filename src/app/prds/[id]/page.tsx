import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PrdEditor } from "@/components/editor/prd-editor";

export default async function PrdEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prd = await prisma.prd.findUnique({ where: { id } });
  if (!prd) notFound();

  return (
    <PrdEditor
      prd={{
        id: prd.id,
        title: prd.title,
        status: prd.status,
        contentMd: prd.contentMd,
        source: prd.source,
      }}
    />
  );
}
