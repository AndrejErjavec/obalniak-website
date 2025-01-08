import {getAscents} from "@/app/lib/actions/ascent";
import AscentItem from "@/components/ascent/AscentItem";
import Link from "next/link";
import Search from "@/components/Search";
import { Suspense } from "react";
import AscentSkeleton from "@/components/ascent/AscentSkeleton";

export default async function Ascents({searchParams}) {
  const query = searchParams.query ?? "";

  const ascents = await getAscents(query);

  return (
    <div className="px-5 mx-auto md:container">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between mt-8">
          <h1 className="text-3xl font-semibold">Naši vzponi</h1>
          <Link href="/ascent/create">
            <button className="px-3 py-2 rounded-md bg-blue-500 text-white">Novo poročilo</button>
          </Link>
        </div>
        <Search />
        <Suspense fallback={<AscentSkeleton />}>
          {ascents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {ascents.map((ascent) => (
                <AscentItem ascent={ascent} key={ascent.id} />
              ))}
            </div>
          ) : (
            <p>Ni najdenih rezultatov</p>
          )}
        </Suspense>
      </div>
    </div>
  )
}