import NewsEditorForm from "@/components/admin/NewsEditorForm";
import { getAdminEvent } from "@/lib/actions/news";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventResponse = await getAdminEvent(id);

  if (!eventResponse.success) {
    return <div>{eventResponse.error}</div>;
  }

  return <NewsEditorForm mode="edit" event={eventResponse.data} />;
}
