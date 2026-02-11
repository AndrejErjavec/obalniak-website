import EventCard from "@/components/events/EventCard";
import { getUpcomingEvents } from "@/lib/actions/event";

export default async function EventsGrid(props) {
  const events = await getUpcomingEvents();

  return (
    <>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <p>Ni dogodkov</p>
      )}
    </>
  );
}
