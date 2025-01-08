import EventCard from "@/components/events/EventCard";
import {getUpcomingEvents} from "@/app/lib/actions/event";

export default async function EventsGrid(props) {
  const events = await getUpcomingEvents();

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {events.map((event) => (
        <EventCard event={event}/>
      ))}
    </div>
  )

}