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

  const eventsResponse = await getEvents(currentPage, 10, "Alpinistična šola");

  if (!eventsResponse.success) {
    return <div>{eventsResponse.error}</div>;
  }

  const { data: news, pagination } = eventsResponse.data;

  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Novice alpinistične šole</h1>
      <NewsGrid news={news} />
      <Pagination totalPages={pagination.totalPages} currentPage={currentPage} />
    </div>
  );
}
