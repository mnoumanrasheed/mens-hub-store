import { ContentEditor } from "@/components/admin/content-editor";
import { getContentForAdmin } from "@/data/cms";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function ContentPage() {
  await requireAdmin();
  const content = await getContentForAdmin();
  return <div className="admin-page"><header className="mb-7"><h1 className="text-3xl font-bold tracking-tight text-admin-ink">Website content</h1><p className="mt-1 max-w-3xl text-sm text-admin-muted">Edit homepage, informational, announcement, policy and help content without changing source code. Empty content is never fabricated for visitors.</p></header><ContentEditor blocks={content.blocks} policies={content.policies} announcement={content.announcement} /></div>;
}
