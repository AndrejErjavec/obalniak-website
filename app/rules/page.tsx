import { FaRegFilePdf } from "react-icons/fa6";

import Link from "next/link";

export default function Rules() {
  return (
    <div className="px-5 mx-auto md:container">
      <h1 className="text-3xl font-semibold my-8">Pravila</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FaRegFilePdf className="text-red-500/90" size={24} />
          <Link href="rules/pravilnik" className="text-lg text-slate-800 underline">
            Pravilnik o delovanju članov
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FaRegFilePdf className="text-red-500/90" size={24} />
          <Link href="rules/statut" className="text-lg text-slate-800 underline">
            Status Obalnega alpinističnega kluba
          </Link>
        </div>
      </div>
    </div>
  );
}
