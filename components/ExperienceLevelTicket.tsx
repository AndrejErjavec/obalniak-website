import { experienceLevel } from "@/util";

export default function ExperienceLevelTicket({ level }: { level: string }) {
  return (
    <div
      className="inline-flex rounded-lg px-2 py-0 font-medium text-center"
      style={{
        backgroundColor: experienceLevel[level].colorBg,
        color: experienceLevel[level].colorText,
      }}
    >
      {experienceLevel[level].name}
    </div>
  );
}
