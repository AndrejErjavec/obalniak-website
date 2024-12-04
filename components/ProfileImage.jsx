export default function ProfileImage({ user, size = 32 }) {
  return (
    <div
      className="w-8 h-8 flex items-center justify-center text-xl text-white rounded-full bg-blue-500 mr-2"
      style={{ width: size, height: size, fontSize: size * 0.6 }}
    >
      {user.firstName.substr(0, 1).toUpperCase()}
    </div>
  );
}
