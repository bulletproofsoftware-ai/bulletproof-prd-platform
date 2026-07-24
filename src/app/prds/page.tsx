import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { PrdList } from "@/components/prds/prd-list";

export default function PrdsPage() {
  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">PRDs</h1>
        <Link href="/prds/upload">
          <Button variant="outline"><Upload className="mr-1 h-4 w-4" /> Upload PRD</Button>
        </Link>
      </div>
      <PrdList />
    </div>
  );
}
