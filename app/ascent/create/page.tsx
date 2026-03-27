import { checkAuth } from "@/lib/actions/auth";
import CreateAscentForm from "./CreateAscentForm";

export default async function CreateAscentPage() {
  const { user } = await checkAuth();

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl">Nimate dostopa do te strani</p>
      </div>
    );
  }

  return <CreateAscentForm userId={user.id} />;
}
