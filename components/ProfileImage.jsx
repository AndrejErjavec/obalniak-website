export default function ProfileImage({ user, size = 32 }) {
  return (
    <div
      className="flex items-center justify-center font-medium text-white rounded-full bg-blue-500"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {user.firstName.substr(0, 1)}{user.lastName.substr(0, 1)}
    </div>
  );
}
