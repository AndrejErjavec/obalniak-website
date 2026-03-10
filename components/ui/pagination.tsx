"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function Pagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageForward = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("currentPage", String(currentPage + 1));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageBackward = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("currentPage", String(currentPage - 1));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-row justify-center items-center gap-5 mt-8">
      {currentPage > 1 && (
        <button className="cursor-pointer" onClick={handlePageBackward}>
          <IoIosArrowBack size={26} />
        </button>
      )}
      <span className="text-lg">
        {currentPage}/{totalPages}
      </span>
      {currentPage < totalPages && (
        <button className="cursor-pointer" onClick={handlePageForward}>
          <IoIosArrowForward size={26} />
        </button>
      )}
    </div>
  );
}

export default Pagination;
