"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Option from "@/components/Option";
import { useEffect, useState } from "react";

export default function Search() {
  const [filterType, setFilterType] = useState("route");

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("filterBy", filterType);
    router.replace(`${pathName}?${params.toString()}`);
  }, [filterType]);

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
    <div className="w-full flex flex-col md:flex-row items-start gap-3 md:gap-2">
      <div className="inline-flex flex-row shrink-0 border border-gray-300 rounded-md overflow-hidden">
        <Option title={"Po smeri"} value={"route"} selectedType={filterType} setSelectedType={setFilterType} />
        <Option title={"Po udeležencih"} value={"climbers"} selectedType={filterType} setSelectedType={setFilterType} />
      </div>
      <form role="search" className="w-full">
        <Input
          id="climbName"
          name="climbName"
          placeholder="Iskalni niz"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
          defaultValue={searchParams.get("query") ?? ""}
        />
      </form>
    </div>
  );
}
