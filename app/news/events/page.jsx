import EventsGrid from "@/components/events/EventsGrid";

export default function Events() {

  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold mt-8 mb-5">Prihajajoči dogodki</h1>
      <EventsGrid />
    </div>
  )
}