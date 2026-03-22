import { getEvents } from "@/lib/actions/news";
import Pagination from "@/components/ui/pagination";
import NewsGrid from "@/components/news/NewsGrid";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.currentPage) || 1;

  const { data, pagination, error } = await getEvents(currentPage, 10, "Običajna novica");

  console.log(pagination);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Novice</h1>
      <NewsGrid news={data} />
      <Pagination totalPages={pagination!.totalPages} currentPage={currentPage} />
    </div>
  );
}
