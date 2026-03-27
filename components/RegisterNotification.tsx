"use client";

import { PiWarningCircleBold } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function RegisterNotification() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("newRegister");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="absolute z-50 bg-yellow-500 w-full">
      <div className="mx-auto px-5 md:container">
        <div className="flex items-center justify-between">
          <div className="py-5 flex items-center gap-3 md:gap-2">
            <PiWarningCircleBold size={26} />
            <p className="font-medium leading-5">Vaš račun bo potrjen s strani administratorja</p>
          </div>
          <button type="button" aria-label="Zapri obvestilo" className="cursor-pointer" onClick={handleClose}>
            <IoClose size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterNotification;
