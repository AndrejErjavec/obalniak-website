import EventsGrid from "@/components/events/EventsGrid";
import { getAscents } from "@/lib/actions/ascent";
import AscentItemSimple from "@/components/ascent/AscentItemSimple";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const ascents = await getAscents();

  return (
    <>
      {/* Cover photo */}
      <div className=" bg-cover bg-center w-full h-80 bg-[url('/hero-bg.JPG')]">
        <div className="px-5 flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl text-center md:text-5xl text-white font-semibold">Gremo v hribe</h1>
        </div>
      </div>

      <div className="px-5 py-10 mx-auto md:container">
        {/* Events and ascents grid */}
        <div className="md:grid md:grid-cols-4 md:gap-10 mb-20">
          {/* News */}
          <div className="md:col-span-3">
            <div className="flex flex-col">
              <h3 className="text-2xl font-semibold mb-2">Novice</h3>
              <div className="h-px w-full bg-gray-300 mb-5" />
              <EventsGrid />
            </div>
          </div>
          {/* Ascents */}
          <div className="w-full md:col-span-1">
            <h3 className="text-2xl font-semibold mb-2">Zadnji vzponi</h3>
            <div className="h-px w-full bg-gray-300 mb-5" />
            <div className=" flex flex-col [&>*]:border-t last:border-b border-gray-300">
              {ascents.map((ascent) => (
                <AscentItemSimple ascent={ascent} key={ascent.id} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facebook feed and links */}
      <div className="px-5 mx-auto md:container mb-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Facebook feed */}
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100086123649589&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=806201063924077"
            width="340"
            height="500"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
          {/* Links */}
          <section>
            <h3 className="text-2xl font-semibold mb-5">Povezave</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="https://www.pzs.si/"
                className="font-medium text-gray-800 hover:text-gray-600 flex flex-row items-center gap-2"
              >
                <Image src="/grb_pzs-tisk.jpg" alt="grb-pzs" width={30} height={30} />
                Planinska zveza Slovenije
              </Link>
              <Link
                href="http://www.slo-alp.com/"
                className="font-medium text-gray-800 hover:text-gray-600 flex flex-row items-center gap-2"
              >
                <Image src="/sloalp-logo.gif" alt="aloalp-logo" width={40} height={40} />
                Slo - Alp
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Weather */}
      <section>
        <div className="w-full bg-[#0382bc]">
          <div className="px-5 py-3 md:container">
            <p className="text-2xl font-medium text-white">Vremenska napoved</p>
          </div>
        </div>
        <iframe
          src="https://vreme.arso.gov.si/widget/?&loc=Koper"
          style={{ border: "0", height: "185px", width: "100%" }}
        />
      </section>
    </>
  );
}
