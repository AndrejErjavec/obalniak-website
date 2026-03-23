import { getAscents } from "@/lib/actions/ascent";
import Link from "next/link";
import Search from "@/components/Search";
import { checkAuth } from "@/lib/actions/auth";
import Pagination from "@/components/ui/Pagination";
import AscentsTable from "@/components/ascent/AscentsTable";

export default async function Ascents({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { isAuthenticated } = await checkAuth();

  const params = await searchParams;
  const query = params.query ?? "";
  const currentPage = Number(params.currentPage) || 1;

  const ascentsResponse = await getAscents(currentPage, 10, query);

  if (!ascentsResponse.success) {
    return <div>{ascentsResponse.error}</div>;
  }

  const { data: ascents, pagination } = ascentsResponse.data;
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="px-5 mx-auto md:container">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between mt-8">
          <h1 className="text-3xl font-semibold">Naši vzponi</h1>
          {isAuthenticated && (
            <Link href="/ascent/create" className="px-3 py-2 rounded-md bg-blue-500 text-white">
              Novo poročilo
            </Link>
          )}
        </div>
        <Search />
        {/* <Suspense fallback={<AscentSkeleton />}> */}
        <AscentsTable ascents={ascents} />
        <Pagination totalPages={totalPages} currentPage={currentPage} />
        {/* </Suspense> */}
      </div>
    </div>
  );
}
