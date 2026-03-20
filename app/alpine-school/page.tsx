import NewsGrid from "@/components/news/NewsGrid";
import Pagination from "@/components/ui/Pagination";
import { getEvents } from "@/lib/actions/news";

export default async function AlpineSchoolNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.currentPage) || 1;

  const { data, pagination, error } = await getEvents(currentPage, 10, "Alpinistična šola");

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Novice alpinistične šole</h1>
      <NewsGrid news={data} />
      <Pagination totalPages={pagination!.totalPages} currentPage={currentPage} />
    </div>
  );
}
