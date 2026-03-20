"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Input from "./ui/Input";
import Button from "./ui/Button";

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
      <Input
        id="climbName"
        name="climbName"
        placeholder="Poiščite vzpon"
        type="text"
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={searchParams.get("query") ?? ""}
      />
      <Button>Iskanje</Button>
    </div>
  );
}
