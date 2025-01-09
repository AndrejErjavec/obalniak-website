import ProfileImage from "@/components/profile/ProfileImage";
import { FaExclamationCircle } from "react-icons/fa";
import ExperienceLevelTicket from "@/components/ExperienceLevelTicket";
import {getUser} from "@/app/lib/actions/user";
import {getUserAscents} from "@/app/lib/actions/ascent";
import {Suspense} from "react";
import AscentSkeleton from "@/components/ascent/AscentSkeleton";
import AscentItem from "@/components/ascent/AscentItem";

export default async function Profile(props) {
  const params = await props.params;
  const id = params.id;

  const [user, ascents] = await Promise.all([
    getUser(id),
    getUserAscents(id)
  ]);

  return (
    <div className="container mx-auto h-screen mt-8">
      {!user.accepted && (
        <div className="flex flex-row items-center gap-1">
          <FaExclamationCircle className="text-orange-600 text-xl" />
          <p className="text-orange-600 font-medium my-5">
            Vaš uporabniški profil še ni potrjen s strani administratorja.
          </p>
        </div>
      )}
      <div className="flex items-center gap-3 pb-10 border-b border-gray-300">
        <ProfileImage firstName={user.firstName} lastName={user.lastName} size={60} />
        <div className="flex flex-col gap-1 items-start">
          <p className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xl font-semibold">{user.name}</p>
          <p>{user.email}</p>

          {user.experienceLevel ? (
            <ExperienceLevelTicket level={user.experienceLevel} />
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* Ascents */}
      <section>
        <div className="flex flex-row gap-3 items-center py-5">
          <h3 className="text-xl font-semibold">Vzponi</h3>
          <div className="flex w-7 h-7 rounded-full bg-slate-500 text-white justify-center items-center">
            <p className="text-sm font-medium">{ascents.length}</p>
          </div>
        </div>
        <div>
          {ascents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {ascents.map((ascent) => (
                <AscentItem ascent={ascent} key={ascent.id}/>
              ))}
            </div>
          ) : (
            <p>Ni vzponov</p>
          )}
        </div>
      </section>
    </div>
  );
}
