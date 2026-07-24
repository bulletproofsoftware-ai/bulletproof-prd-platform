import { IdeasBoard } from "@/components/ideas/ideas-board";

export default function IdeasPage() {
  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Ideas</h1>
      <IdeasBoard />
    </div>
  );
}
