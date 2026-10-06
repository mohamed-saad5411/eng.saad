// place at: src/app/api/admin/documents/[...path]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  await requireAdmin(); // throws/redirects non-admins before touching storage

  const { path } = await params;
  const objectPath = path.join("/");

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("student-documents")
    .createSignedUrl(objectPath, 60); // 60s is enough for a redirect + view

  if (error || !data) {
    return NextResponse.json({ error: "document_not_found" }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}