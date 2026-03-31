import { FiMail } from "react-icons/fi";
import ExperienceLevelTicket from "@/components/ExperienceLevelTicket";
import { getUser } from "@/lib/actions/user";
import { getUserAscents } from "@/lib/actions/ascent";
import AscentsTable from "@/components/ascent/AscentsTable";
import ProfileImage from "@/components/profile/ProfileImage";
import Pagination from "@/components/ui/Pagination";

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

  const [userResponse, ascentsResponse] = await Promise.all([getUser(id), getUserAscents(id, currentPage, PAGE_SIZE)]);

  if (!ascentsResponse.success || !userResponse.success) {
    return <div>Napaka pri nalaganju podatkov</div>;
  }

  const user = userResponse.data;

  const { data: ascents, pagination } = ascentsResponse.data;

  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || 0;

  return (
    <div className="px-5 mx-auto md:container mt-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-row gap-4">
            <ProfileImage text={`${user.firstName.substring(0, 1)}${user.lastName.substring(0, 1)}`} size={84} />

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                    {user.firstName} {user.lastName}
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 md:text-base">
                  <FiMail size={16} className="shrink-0" />
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {user.experienceLevel ? (
                  <ExperienceLevelTicket level={user.experienceLevel} />
                ) : (
                  <div className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                    Stopnja še ni določena
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ascents */}
      <section className="mt-8">
        <AscentsTable ascents={ascents} totalAscents={totalItems} withHeader={true} />
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </section>
    </div>
  );
}
