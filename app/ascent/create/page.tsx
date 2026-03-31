import AscentEditorForm from "@/components/ascent/AscentEditorForm";
import { checkAuth } from "@/lib/actions/auth";

export default async function CreateAscentPage() {
  const { user } = await checkAuth();

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl">Nimate dostopa do te strani</p>
      </div>
    );
  }

  return <AscentEditorForm mode="create" userId={user.id} />;
}
