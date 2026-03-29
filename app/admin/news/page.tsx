import Link from "next/link";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { BsPinAngleFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import DeleteNewsButton from "@/components/admin/DeleteNewsButton";
import { getAdminEvents } from "@/lib/actions/news";

const PAGE_SIZE = 10;

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.currentPage) || 1;
  const eventsResponse = await getAdminEvents(currentPage, PAGE_SIZE);

  if (!eventsResponse.success) {
    return <div>{eventsResponse.error}</div>;
  }

  const { data: events, pagination } = eventsResponse.data;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-row gap-4 justify-between">
        <h1 className="text-xl font-semibold lg:text-2xl leading-10">Novice</h1>
        <Link href="/admin/news/create">
          <Button>Nova novica</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Nimate objavljenih novic.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <article key={event.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-md font-semibold text-gray-900">{event.title}</h2>
                      {event.isPinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          <BsPinAngleFill />
                          Pripeto
                        </span>
                      )}
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-700">
                        {event.type}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                      <span>Objavljeno: {format(event.createdAt, "dd. MM. yyyy", { locale: sl })}</span>
                      <span>
                        Avtor: {event.author.firstName} {event.author.lastName}
                      </span>
                      {event.date && <span>Datum dogodka: {format(event.date, "dd. MM. yyyy", { locale: sl })}</span>}
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">{event.text}</p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link href={`/admin/news/${event.id}/edit`}>
                      <Button type="button" variant="secondary">
                        <span className="inline-flex items-center gap-2">
                          <MdEdit size={18} />
                          Uredi
                        </span>
                      </Button>
                    </Link>
                    <DeleteNewsButton eventId={event.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Pagination totalPages={pagination.totalPages} currentPage={currentPage} />
        </>
      )}
    </section>
  );
}
