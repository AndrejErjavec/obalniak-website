import { getAscents } from "@/lib/actions/ascent";
import Link from "next/link";
import Search from "@/components/Search";
import { checkAuth } from "@/lib/actions/auth";
import Pagination from "@/components/ui/Pagination";
import AscentsTable from "@/components/ascent/AscentsTable";
import Button from "@/components/ui/Button";
import { AscentFilterType } from "@/types";
import Divider from "@/components/ui/Divider";

export default async function Ascents({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { isAuthenticated } = await checkAuth();

  const params = await searchParams;
  const query = params.query ?? "";
  const filterBy = (params.filterBy as AscentFilterType) ?? ("route" as AscentFilterType);
  const currentPage = Number(params.currentPage) || 1;

  const ascentsResponse = await getAscents(currentPage, 10, query, filterBy);

  if (!ascentsResponse.success) {
    return <div>{ascentsResponse.error}</div>;
  }

  const { data: ascents, pagination } = ascentsResponse.data;
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="px-5 mx-auto md:container">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between mt-8 mb-5">
          <h1 className="text-3xl font-semibold">Naši vzponi</h1>
          {isAuthenticated && (
            <Link href="/ascent/create">
              <Button>Novo poročilo</Button>
            </Link>
          )}
        </div>
        <Divider />
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm text-gray-500">Vzpone lahko iščete po imenu smeri ali po imenih udeležencev</p>
          <Search />
        </div>
        {/* <Suspense fallback={<AscentSkeleton />}> */}
        <AscentsTable ascents={ascents} withHeader={false} />
        <Pagination totalPages={totalPages} currentPage={currentPage} />
        {/* </Suspense> */}
      </div>
    </div>
  );
}
