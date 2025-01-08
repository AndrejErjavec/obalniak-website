import ProfileImage from "@/components/profile/ProfileImage";
import { FaExclamationCircle } from "react-icons/fa";
import ExperienceLevelTicket from "@/components/ExperienceLevelTicket";
import {getUser} from "@/app/lib/actions/user";

export default async function Profile(props) {
  const params = await props.params;
  const id = params.id;

  const user = await getUser(id);

  return (
    <div className="container mx-auto h-screen">
      {!user.accepted ? (
        <div className="flex flex-row items-center gap-1">
          <FaExclamationCircle className="text-orange-600 text-xl" />
          <p className="text-orange-600 font-medium my-5">
            Vaš uporabniški profil še ni potrjen s strani administratorja.
          </p>
        </div>
      ) : (
        <></>
      )}
      <div className="shadow-lg rounded-lg flex items-center p-6 w-full max-w-sm gap-3">
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
    </div>
  );
}
