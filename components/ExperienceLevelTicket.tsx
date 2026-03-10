import { experienceLevel } from "@/util";

export default function ExperienceLevelTicket({ level }) {
  return (
    <div
      className="rounded-lg px-2 py-0 font-semibold text-center"
      style={{
        backgroundColor: experienceLevel[level].colorBg,
        color: experienceLevel[level].colorText,
      }}
    >
      {experienceLevel[level].name}
    </div>
  );
}
