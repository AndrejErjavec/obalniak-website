import EventsGrid from "@/components/events/EventsGrid";
import { getEvents } from "@/lib/actions/event";
import Pagination from "@/components/ui/pagination";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.currentPage) || 1;

  const { data, pagination, error } = await getEvents(currentPage, 10);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold mt-8 mb-5">Novice</h1>
      <EventsGrid events={data} />
      <Pagination totalPages={pagination!.totalPages} currentPage={currentPage} />
    </div>
  );
}
