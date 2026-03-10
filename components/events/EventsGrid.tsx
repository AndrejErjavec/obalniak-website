import EventCard from "@/components/events/EventCard";

export default async function EventsGrid({ events }) {
  // const pathName = usePathname();
  // const searchParams = useSearchParams();
  // const currentPage = Number(searchParams.get("page") || 1);

  // const createPageURL = (pageNumber: number | string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("page", pageNumber.toString());
  //   return `${pathName}?${params.toString()}`;
  // };

  return (
    <>
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, idx: number) => (
            <EventCard event={event} key={idx} />
          ))}
        </div>
      ) : (
        <p>Ni dogodkov</p>
      )}
    </>
  );
}
