import AscentEditorForm from "@/components/ascent/AscentEditorForm";
import { getAscent } from "@/lib/actions/ascent";
import { checkAuth } from "@/lib/actions/auth";

async function EditAscentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await checkAuth();
  if (!user) {
    return <div>Nimate dostopa do te strani</div>;
  }

  const ascentResponse = await getAscent(id);

  if (!ascentResponse.success) {
    return <div>{ascentResponse.error}</div>;
  }

  return <AscentEditorForm mode="edit" ascent={ascentResponse.data} userId={user.id} />;
}

export default EditAscentPage;
