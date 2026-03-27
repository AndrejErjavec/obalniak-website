import cn from "clsx";
import { experienceLevel } from "@/util";

export default function ExperienceLevelTicket({ level }: { level: string }) {
  const levelClasses: Record<string, string> = {
    TECAJNIK: "bg-green-100 text-green-900 ring-1 ring-green-200",
    MLAJSI_PRIPRAVNIK: "bg-blue-100 text-blue-900 ring-1 ring-blue-200",
    STAREJSI_PRIPRAVNIK: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
    ALPINIST: "bg-orange-100 text-orange-900 ring-1 ring-orange-200",
    ALPINISTICNI_INSTRUKTOR: "bg-red-100 text-red-900 ring-1 ring-red-200",
  };

  return (
    <div
      className={cn(
        "inline-flex rounded-lg px-3 py-1 text-center text-sm font-semibold",
        levelClasses[level] ?? "bg-slate-100 text-slate-800 ring-1 ring-slate-200",
      )}
    >
      {experienceLevel[level].name}
    </div>
  );
}
