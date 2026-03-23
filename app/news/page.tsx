import { getEvents } from "@/lib/actions/news";
import Pagination from "@/components/ui/Pagination";
import NewsGrid from "@/components/news/NewsGrid";

export default async function NewsPage({
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
      <h1 className="text-3xl font-semibold my-8">Novice</h1>
      <NewsGrid news={news} />
      <Pagination totalPages={pagination!.totalPages} currentPage={currentPage} />
    </div>
  );
}
