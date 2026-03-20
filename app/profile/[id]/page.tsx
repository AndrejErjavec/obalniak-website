import { FaExclamationCircle } from "react-icons/fa";
import ExperienceLevelTicket from "@/components/ExperienceLevelTicket";
import { getUser } from "@/lib/actions/user";
import { getUserAscents } from "@/lib/actions/ascent";
import AscentsTable from "@/components/ascent/AscentsTable";
import Pagination from "@/components/ui/Pagination";
import ProfileImage from "@/components/profile/ProfileImage";
import Divider from "@/components/ui/Divider";

export default async function Profile({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const PAGE_SIZE = 10;

  const { id } = await params;
  const srchParams = await searchParams;
  const currentPage = Number(srchParams.currentPage) || 1;

  const [user, { data: ascents, pagination }] = await Promise.all([
    getUser(id),
    getUserAscents(id, currentPage, PAGE_SIZE),
  ]);
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="px-5 mx-auto md:container mt-8">
      {!user.accepted && (
        <div className="flex flex-row items-center gap-1">
          <FaExclamationCircle className="text-orange-600 text-xl" />
          <p className="text-orange-600 font-medium my-5">
            Vaš uporabniški profil še ni potrjen s strani administratorja.
          </p>
        </div>
      )}
      <div className="pb-10">
        <div className="flex items-start gap-5">
          <ProfileImage firstName={user.firstName} lastName={user.lastName} size={70} />
          <div className="flex flex-col gap-1 items-start">
            <p className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-base font-medium">{user.email}</p>

            {user.experienceLevel ? <ExperienceLevelTicket level={user.experienceLevel} /> : <></>}
          </div>
        </div>
      </div>
      <Divider />
      {/* Ascents */}
      <section>
        <div className="flex flex-row gap-3 items-center py-5">
          <h3 className="text-xl font-semibold">Vzponi</h3>
          <div className="flex w-7 h-7 rounded-full bg-slate-500 text-white justify-center items-center">
            <p className="text-sm font-medium">{PAGE_SIZE * totalPages}</p>
          </div>
        </div>
        <AscentsTable ascents={ascents} />
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </section>
    </div>
  );
}
