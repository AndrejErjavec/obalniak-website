"use client"

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useDebouncedCallback} from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const handleChange = useDebouncedCallback((query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.replace(`${pathName}?${params.toString()}`);
  }, 200);

  return (
    <div className="w-full flex items-center gap-2">
      <input
        id="climbName"
        name="climbName"
        placeholder="Poiščite vzpon"
        type="text"
        className="border rounded w-full py-2 px-3"
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={searchParams.get("query") ?? ""}
      />
      <button className="px-3 py-2 rounded-md bg-blue-500 text-white">Iskanje</button>
    </div>
  )
}